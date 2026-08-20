#!/bin/bash

set -e

CLUSTER_NAME=chaos
API_PORT=6443

# =============================================================================
# Binary Verification Helper Function
# =============================================================================
verify_binary() {
    local binary=$1
    if ! command -v "$binary" &> /dev/null; then
        echo "ERROR: Required binary '$binary' is not found in PATH."
        echo "Please install "$binary" and ensure it is in your PATH."
        exit 1
    fi
}

# =============================================================================
# Verify Required Binaries
# =============================================================================
echo "Verifying required binaries..."
verify_binary "k3d"
verify_binary "kubectl"
echo "✓ All required binaries are available"
echo ""

# =============================================================================
# Create k3d Cluster
# =============================================================================
echo "Creating k3d cluster '$CLUSTER_NAME'..."
k3d cluster create "$CLUSTER_NAME" --api-port "$API_PORT" -p "8080:8080@loadbalancer"
echo "✓ k3d cluster created successfully"
echo ""

# =============================================================================
# Setup Complete
# =============================================================================
echo "k3d cluster setup completed successfully!"

# =============================================================================
# Setup Argo CD Namespace and Resources
# =============================================================================
echo "Creating Kubernetes namespace 'argocd'..."
kubectl create namespace argocd
echo "Installing ArgoCD CRD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
echo "Installing ArgoCD App..."
kubectl apply -f bootstrap/gitops/argocd.yaml