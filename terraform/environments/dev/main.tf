# Finance4All Development Environment Infrastructure

# Networking Module
module "networking" {
  source = "../../modules/networking"

  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  vpc_name    = var.vpc_name
  subnet_cidr = var.subnet_cidr
  labels      = var.labels
}

# Database Module (Cloud SQL PostgreSQL)
module "database" {
  source = "../../modules/database"

  project_id       = var.project_id
  region           = var.region
  environment      = var.environment
  instance_name    = var.db_instance_name
  database_version = var.db_version
  tier             = var.db_tier
  database_name    = var.db_name
  database_user    = var.db_user
  vpc_network      = module.networking.vpc_self_link
  private_network  = module.networking.private_vpc_connection
  labels           = var.labels

  depends_on = [module.networking]
}

# Storage Module (Cloud Storage, Redis, Firestore)
module "storage" {
  source = "../../modules/storage"

  project_id                  = var.project_id
  region                      = var.region
  environment                 = var.environment
  storage_bucket_name         = var.storage_bucket_name
  terraform_state_bucket_name = var.terraform_state_bucket_name
  redis_instance_name         = var.redis_instance_name
  redis_tier                  = var.redis_tier
  redis_memory_size_gb        = var.redis_memory_size_gb
  firestore_location          = var.firestore_location
  vpc_network                 = module.networking.vpc_self_link
  labels                      = var.labels

  depends_on = [module.networking]
}

# Compute Module (Cloud Run services - placeholder for now)
module "compute" {
  source = "../../modules/compute"

  project_id            = var.project_id
  region                = var.region
  environment           = var.environment
  backend_service_name  = var.backend_service_name
  frontend_service_name = var.frontend_service_name
  labels                = var.labels

  # Will be populated when we have Docker images
  depends_on = [module.database, module.storage]
}

# Security Module (IAM, Secret Manager)
module "security" {
  source = "../../modules/security"

  project_id  = var.project_id
  environment = var.environment
  labels      = var.labels
}
