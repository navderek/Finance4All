# Finance4All Terraform Infrastructure

This directory contains the Terraform configuration for managing Finance4All's cloud infrastructure on Google Cloud Platform (GCP).

## Directory Structure

```
terraform/
├── environments/          # Environment-specific configurations
│   ├── dev/              # Development environment
│   ├── staging/          # Staging environment
│   └── prod/             # Production environment
├── modules/              # Reusable Terraform modules
│   ├── networking/       # VPC, subnets, firewall rules
│   ├── database/         # Cloud SQL (PostgreSQL)
│   ├── storage/          # Cloud Storage, Redis, Firestore
│   ├── compute/          # Cloud Run services
│   └── security/         # IAM, Secret Manager
└── README.md            # This file
```

## Prerequisites

1. **Terraform** >= 1.0 installed
2. **gcloud CLI** installed and authenticated
3. **GCP Service Account** key file at `~/.gcp/finance4all-terraform-key.json`
4. **GCP Project** created (finance4all-dev, finance4all-staging, finance4all-prod)
5. **Required APIs** enabled (see CLAUDE.md for full list)

## Quick Start

### 1. Navigate to the environment directory

```bash
cd terraform/environments/dev
```

### 2. Create terraform.tfvars file

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your specific values if needed
```

### 3. Fix the credentials path in terraform.tfvars

The tilde (~) doesn't expand in Terraform. Update the credentials_file path:

```hcl
credentials_file = "/home/admin/.gcp/finance4all-terraform-key.json"
```

Replace `/home/admin` with your actual home directory path.

### 4. Initialize Terraform

```bash
terraform init
```

This will download the required provider plugins.

### 5. Validate the configuration

```bash
terraform validate
```

### 6. Plan the infrastructure

```bash
terraform plan
```

Review the plan to see what resources will be created.

### 7. Apply the configuration

```bash
terraform apply
```

Type `yes` when prompted to create the resources.

## Infrastructure Components

### Networking Module
- **VPC Network**: Isolated network for Finance4All resources
- **Subnet**: Private subnet with CIDR 10.0.0.0/24
- **Firewall Rules**: Security rules for internal and health check traffic
- **VPC Connector**: Allows Cloud Run to access VPC resources
- **Private Service Connection**: For Cloud SQL private IP

### Database Module
- **Cloud SQL PostgreSQL 15**: Managed PostgreSQL database
- **Automatic Backups**: Daily backups at 3 AM
- **SSL Encryption**: Required for all connections
- **Secret Manager**: Stores database password securely

### Storage Module
- **Cloud Storage**: For file uploads, documents, exports
- **Terraform State Bucket**: Stores Terraform state (versioned)
- **Cloud Memorystore (Redis)**: For caching and session storage
- **Firestore**: For real-time data synchronization

### Security Module
- **Service Accounts**: For backend and frontend applications
- **IAM Policies**: Least-privilege access to resources
- **Secret Manager**: Centralized secrets management

### Compute Module
- **Placeholder**: Will contain Cloud Run services in later phases

## Important Notes

### Costs
- **Development**: Optimized for low cost (free tier where possible)
- **Estimated dev cost**: ~$20-30/month with minimal usage
- **Production**: Will use regional instances and more resources

### Security
- Never commit `terraform.tfvars` or `*.tfstate` files to git
- Service account keys are stored locally only
- Database passwords are auto-generated and stored in Secret Manager

### State Management
- Initially stored locally
- After first apply, migrate to GCS backend for team collaboration
- State is versioned and backed up

## Common Commands

```bash
# Initialize Terraform
terraform init

# Format Terraform files
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Show current state
terraform show

# List all resources
terraform state list

# Destroy all resources (BE CAREFUL!)
terraform destroy

# Get outputs
terraform output

# Get specific output
terraform output db_connection_name
```

## Migrating to Remote State

After the initial `terraform apply`, the Terraform state bucket will be created. You can then migrate to remote state:

1. Uncomment the backend configuration in `provider.tf`
2. Run `terraform init -migrate-state`
3. Confirm the migration

## Troubleshooting

### Error: Credentials file not found
- Verify the path to your service account key file
- Use absolute path instead of ~
- Check file permissions: `chmod 600 ~/.gcp/finance4all-terraform-key.json`

### Error: API not enabled
- Enable required APIs: `gcloud services enable SERVICE_NAME`
- Wait a few minutes for API enablement to propagate

### Error: Insufficient permissions
- Verify service account has correct IAM roles
- Check project-level permissions

### Error: Resource already exists
- Import existing resource: `terraform import RESOURCE_TYPE.NAME RESOURCE_ID`
- Or rename the resource in Terraform

## Next Steps

1. **Phase 0**: Complete infrastructure setup (you are here!)
2. **Phase 1**: Deploy backend application to Cloud Run
3. **Phase 2**: Deploy frontend application to Cloud Run
4. **Phase 3+**: Add advanced features and scale infrastructure

## Support

For questions or issues:
- Check CLAUDE.md for project guidelines
- Review ProgressTracker.md for current status
- Consult GCP documentation: https://cloud.google.com/docs
- Terraform GCP provider docs: https://registry.terraform.io/providers/hashicorp/google/latest/docs
