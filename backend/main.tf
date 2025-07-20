terraform {
  
  backend "s3" {
    bucket = "fitlog-terraform-bucket"
    key    = "terraform/terraform.tfstate"
    region = "ap-southeast-2"
    encrypt = true
  }

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "1.7.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "1.5.1"
    }
  }
}

variable "RENDER_API_KEY" {}
variable "RENDER_OWNER_ID" {}
variable "GHCR_USERNAME" {}
variable "GHCR_PAT" {}
variable "SUPABASE_ACCESS_TOKEN" {}
variable "SUPABASE_ORGANIZATION_ID" {}
variable "SUPABASE_DATABASE_PASSWORD" {}
variable "SECRET_KEY" {}

provider "render" {
    api_key = var.RENDER_API_KEY 
    owner_id = var.RENDER_OWNER_ID 
}

provider "supabase" {
    access_token = var.SUPABASE_ACCESS_TOKEN 
}


# Create Github Container Registry credential 

resource "render_registry_credential" "ghcr_credential" {
    name       = "ghcr_credential"
    registry   = "GITHUB"
    username   = var.GHCR_USERNAME 
    auth_token = var.GHCR_PAT 
}


# Create web service using Docker image

resource "render_web_service" "fitlog-backend" {
    name               = "fitlog-backend"
    plan               = "starter"
    region             = "singapore"
    runtime_source     = {
        image = {
            image_url = "ghcr.io/nathanpee2006/fitlog-backend"
            tag = "latest"
            registry_credential_id = render_registry_credential.ghcr_credential.id
        }
    } 

    env_vars = {
        SECRET_KEY = {value=var.SECRET_KEY}
    }

    lifecycle {
      ignore_changes = [
        env_vars 
      ]
    }
}


# Create PostgreSQL database using Supabase

resource "supabase_project" "fitlog-db" {
    organization_id = var.SUPABASE_ORGANIZATION_ID 
    name = "fitlog-db"
    database_password = var.SUPABASE_DATABASE_PASSWORD 
    region = "ap-southeast-1"
}
