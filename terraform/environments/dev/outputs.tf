# VPC Outputs
output "vpc_name" {
  description = "Name of the VPC network"
  value       = module.networking.vpc_name
}

output "vpc_self_link" {
  description = "Self link of the VPC network"
  value       = module.networking.vpc_self_link
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = module.networking.subnet_name
}

# Database Outputs
output "db_instance_name" {
  description = "Name of the Cloud SQL instance"
  value       = module.database.instance_name
}

output "db_connection_name" {
  description = "Connection name for the Cloud SQL instance"
  value       = module.database.connection_name
}

output "db_private_ip" {
  description = "Private IP address of the Cloud SQL instance"
  value       = module.database.private_ip_address
  sensitive   = true
}

output "db_public_ip" {
  description = "Public IP address of the Cloud SQL instance"
  value       = module.database.public_ip_address
}

# Redis Outputs
output "redis_host" {
  description = "Host address of the Redis instance"
  value       = module.storage.redis_host
  sensitive   = true
}

output "redis_port" {
  description = "Port of the Redis instance"
  value       = module.storage.redis_port
}

# Storage Outputs
output "storage_bucket_name" {
  description = "Name of the Cloud Storage bucket"
  value       = module.storage.bucket_name
}

output "storage_bucket_url" {
  description = "URL of the Cloud Storage bucket"
  value       = module.storage.bucket_url
}

output "terraform_state_bucket_name" {
  description = "Name of the Terraform state bucket"
  value       = module.storage.terraform_state_bucket_name
}

# Firestore Outputs
output "firestore_database_name" {
  description = "Name of the Firestore database"
  value       = module.storage.firestore_database_name
}

# Project Info
output "project_id" {
  description = "The GCP project ID"
  value       = var.project_id
}

output "region" {
  description = "The GCP region"
  value       = var.region
}

output "environment" {
  description = "The environment name"
  value       = var.environment
}
