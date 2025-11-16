# Project Configuration
variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "finance4all-dev"
}

variable "region" {
  description = "The GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone for resources"
  type        = string
  default     = "us-central1-a"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "credentials_file" {
  description = "Path to the GCP service account credentials JSON file"
  type        = string
  default     = "~/.gcp/finance4all-terraform-key.json"
}

# Networking Configuration
variable "vpc_name" {
  description = "Name of the VPC network"
  type        = string
  default     = "finance4all-vpc"
}

variable "subnet_cidr" {
  description = "CIDR range for the subnet"
  type        = string
  default     = "10.0.0.0/24"
}

# Database Configuration
variable "db_instance_name" {
  description = "Name of the Cloud SQL instance"
  type        = string
  default     = "finance4all-db"
}

variable "db_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "POSTGRES_15"
}

variable "db_tier" {
  description = "Machine type for the database instance"
  type        = string
  default     = "db-f1-micro" # Free tier eligible
}

variable "db_name" {
  description = "Name of the default database"
  type        = string
  default     = "finance4all"
}

variable "db_user" {
  description = "Database user name"
  type        = string
  default     = "finance4all_user"
}

# Redis Configuration
variable "redis_instance_name" {
  description = "Name of the Redis instance"
  type        = string
  default     = "finance4all-cache"
}

variable "redis_tier" {
  description = "Redis service tier"
  type        = string
  default     = "BASIC"
}

variable "redis_memory_size_gb" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1
}

# Storage Configuration
variable "storage_bucket_name" {
  description = "Name of the Cloud Storage bucket"
  type        = string
  default     = "finance4all-dev-storage"
}

variable "terraform_state_bucket_name" {
  description = "Name of the bucket for Terraform state"
  type        = string
  default     = "finance4all-dev-terraform-state"
}

# Firestore Configuration
variable "firestore_location" {
  description = "Location for Firestore database"
  type        = string
  default     = "nam5" # North America multi-region
}

# Cloud Run Configuration
variable "backend_service_name" {
  description = "Name of the backend Cloud Run service"
  type        = string
  default     = "finance4all-backend"
}

variable "frontend_service_name" {
  description = "Name of the frontend Cloud Run service"
  type        = string
  default     = "finance4all-frontend"
}

# Tags
variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default = {
    environment = "dev"
    project     = "finance4all"
    managed_by  = "terraform"
  }
}
