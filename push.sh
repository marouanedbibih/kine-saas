#!/bin/bash

# push.sh - Automates Git stage, commit, and push operations
# Usage: ./push.sh [commit message]

# Set error handling
set -e

# Function to display error message and exit
error_exit() {
  echo "Error: $1" >&2
  exit 1
}

# Function to check if Git repository exists
check_git_repo() {
  if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    error_exit "Not a git repository. Please run this script inside a git repository."
  fi
}

# Function to check and switch to main branch
switch_to_main() {
  local current_branch=$(git rev-parse --abbrev-ref HEAD)
  
  if [ "$current_branch" != "main" ]; then
    echo "Currently on branch '$current_branch'. Switching to 'main'..."
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
      error_exit "You have uncommitted changes. Please commit or stash them before switching branches."
    fi
    
    # Try to switch to main branch
    if ! git checkout main; then
      error_exit "Failed to switch to 'main' branch. Does it exist?"
    fi
    
    echo "Successfully switched to 'main' branch."
  else
    echo "Already on 'main' branch."
  fi
}

# Function to stage changes
stage_changes() {
  echo "Staging changes..."
  git add .
  
  # Check if there are staged changes
  if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 0
  fi
}

# Function to commit changes
commit_changes() {
  local commit_msg="$1"
  
  # If no commit message provided, use default or prompt for one
  if [ -z "$commit_msg" ]; then
    read -p "Enter commit message [Update project files]: " input_msg
    commit_msg="${input_msg:-Update project files}"
  fi
  
  echo "Committing with message: '$commit_msg'"
  git commit -m "$commit_msg"
}

# Function to push to remote
push_to_remote() {
  echo "Pushing to origin/main..."
  if ! git push origin main; then
    error_exit "Failed to push to origin/main. Check your network connection and permissions."
  fi
  echo "Successfully pushed to origin/main."
}

# Main execution
main() {
  local commit_msg="$1"
  
  # Check if we're in a git repo
  check_git_repo
  
  # Check and switch to main branch
  switch_to_main
  
  # Stage all changes
  stage_changes
  
  # Commit changes
  commit_changes "$commit_msg"
  
  # Push to remote
  push_to_remote
  
  echo "All done! Changes have been staged, committed, and pushed to origin/main."
}

# Execute main function with all arguments
main "$@"
