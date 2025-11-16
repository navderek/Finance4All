# Cloud Storage bucket for application data
resource "google_storage_bucket" "app_storage" {
  name          = var.storage_bucket_name
  location      = var.region
  project       = var.project_id
  force_destroy = var.environment != "prod" # Allow deletion in dev/staging

  uniform_bucket_level_access = true

  versioning {
    enabled = var.environment == "prod"
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }

  cors {
    origin          = ["*"] # Will be restricted in production
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = var.labels
}

# Cloud Storage bucket for Terraform state
resource "google_storage_bucket" "terraform_state" {
  name          = var.terraform_state_bucket_name
  location      = var.region
  project       = var.project_id
  force_destroy = false # Never allow deletion of state bucket

  uniform_bucket_level_access = true

  versioning {
    enabled = true # Always version Terraform state
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 10
    }
    action {
      type = "Delete"
    }
  }

  labels = var.labels
}

# Cloud Memorystore (Redis) instance
resource "google_redis_instance" "cache" {
  name           = var.redis_instance_name
  tier           = var.redis_tier
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region
  project        = var.project_id

  redis_version = "REDIS_7_0"

  # Network configuration
  authorized_network = var.vpc_network
  connect_mode       = "PRIVATE_SERVICE_ACCESS"

  # Redis configuration
  redis_configs = {
    maxmemory-policy = "allkeys-lru"
  }

  # Maintenance policy
  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 3
        minutes = 0
      }
    }
  }

  labels = var.labels
}

# Firestore Database (Native Mode)
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.firestore_location
  type        = "FIRESTORE_NATIVE"

  # Concurrency mode
  concurrency_mode = "OPTIMISTIC"

  # Point in time recovery
  point_in_time_recovery_enablement = var.environment == "prod" ? "POINT_IN_TIME_RECOVERY_ENABLED" : "POINT_IN_TIME_RECOVERY_DISABLED"

  # Deletion policy
  delete_protection_state = var.environment == "prod" ? "DELETE_PROTECTION_ENABLED" : "DELETE_PROTECTION_DISABLED"
}
