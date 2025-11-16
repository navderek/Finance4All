# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "${var.vpc_name}-${var.environment}"
  auto_create_subnetworks = false
  project                 = var.project_id
}

# Subnet
resource "google_compute_subnetwork" "subnet" {
  name          = "${var.vpc_name}-subnet-${var.environment}"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  # Enable private Google access for accessing GCP services
  private_ip_google_access = true
}

# Reserve IP range for private service connection (for Cloud SQL)
resource "google_compute_global_address" "private_ip_range" {
  name          = "private-ip-range-${var.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
  project       = var.project_id
}

# Create private VPC connection for Cloud SQL
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

# Firewall rule to allow internal traffic
resource "google_compute_firewall" "allow_internal" {
  name    = "allow-internal-${var.environment}"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  source_ranges = [var.subnet_cidr]
}

# Firewall rule to allow health checks
resource "google_compute_firewall" "allow_health_check" {
  name    = "allow-health-check-${var.environment}"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
  }

  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"]
  target_tags   = ["allow-health-check"]
}

# Serverless VPC Access Connector (for Cloud Run to access VPC resources)
resource "google_vpc_access_connector" "connector" {
  name          = "vpc-connector-${var.environment}"
  region        = var.region
  network       = google_compute_network.vpc.name
  project       = var.project_id
  ip_cidr_range = "10.8.0.0/28"

  max_throughput = 300 # Mbps (200-1000 range)
}
