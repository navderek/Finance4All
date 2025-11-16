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

variable "backend_service_name" {
  description = "Name of the backend Cloud Run service"
  type        = string
}

variable "frontend_service_name" {
  description = "Name of the frontend Cloud Run service"
  type        = string
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}
