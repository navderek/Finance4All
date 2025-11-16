output "bucket_name" {
  description = "Name of the Cloud Storage bucket"
  value       = google_storage_bucket.app_storage.name
}

output "bucket_url" {
  description = "URL of the Cloud Storage bucket"
  value       = google_storage_bucket.app_storage.url
}

output "terraform_state_bucket_name" {
  description = "Name of the Terraform state bucket"
  value       = google_storage_bucket.terraform_state.name
}

output "redis_host" {
  description = "Host address of the Redis instance"
  value       = google_redis_instance.cache.host
}

output "redis_port" {
  description = "Port of the Redis instance"
  value       = google_redis_instance.cache.port
}

output "redis_connection_string" {
  description = "Connection string for Redis"
  value       = "${google_redis_instance.cache.host}:${google_redis_instance.cache.port}"
}

output "firestore_database_name" {
  description = "Name of the Firestore database"
  value       = google_firestore_database.database.name
}
