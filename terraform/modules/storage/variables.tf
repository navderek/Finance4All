variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "storage_bucket_name" {
  description = "Name of the Cloud Storage bucket"
  type        = string
}

variable "terraform_state_bucket_name" {
  description = "Name of the Terraform state bucket"
  type        = string
}

variable "redis_instance_name" {
  description = "Name of the Redis instance"
  type        = string
}

variable "redis_tier" {
  description = "Redis service tier"
  type        = string
}

variable "redis_memory_size_gb" {
  description = "Redis memory size in GB"
  type        = number
}

variable "firestore_location" {
  description = "Location for Firestore database"
  type        = string
}

variable "vpc_network" {
  description = "VPC network self link"
  type        = string
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}
