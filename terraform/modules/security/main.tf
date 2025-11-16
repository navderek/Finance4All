# IAM and Secret Manager configuration

# Service account for backend application
resource "google_service_account" "backend" {
  account_id   = "finance4all-backend-${var.environment}"
  display_name = "Finance4All Backend Service Account (${var.environment})"
  project      = var.project_id
}

# Service account for frontend application
resource "google_service_account" "frontend" {
  account_id   = "finance4all-frontend-${var.environment}"
  display_name = "Finance4All Frontend Service Account (${var.environment})"
  project      = var.project_id
}

# Grant backend service account access to Cloud SQL
resource "google_project_iam_member" "backend_sql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

# Grant backend service account access to Secret Manager
resource "google_project_iam_member" "backend_secrets" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

# Grant backend service account access to Cloud Storage
resource "google_project_iam_member" "backend_storage" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

# Grant backend service account access to Firestore
resource "google_project_iam_member" "backend_firestore" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

# Grant backend service account access to Pub/Sub
resource "google_project_iam_member" "backend_pubsub" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.backend.email}"
}

# Grant frontend service account access to Cloud Storage
resource "google_project_iam_member" "frontend_storage" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.frontend.email}"
}

# Grant frontend service account access to Firestore
resource "google_project_iam_member" "frontend_firestore" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.frontend.email}"
}
