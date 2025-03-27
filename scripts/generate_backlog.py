#!/usr/bin/env python3
import json
import re
from collections import defaultdict

# Load the issues from the JSON file
with open('/tmp/all_open_issues.json', 'r') as f:
    issues = json.load(f)

# Define the main categories based on the ROADMAP.md
categories = {
    "Core Primitives": [
        "Functions.do", 
        "Workflows.do", 
        "Agents.do"
    ],
    "Event System": [
        "Triggers.do", 
        "Searches.do", 
        "Actions.do"
    ],
    "Foundation Components": [
        "LLM.do", 
        "Database.do", 
        "Evals.do", 
        "Integrations.do"
    ],
    "API Experience": [
        "APIs.do"
    ],
    "SDK Development": [
        "SDK General"
    ],
    "Documentation & Website": [
        "Docs", 
        "Website"
    ],
    "Infrastructure": [
        "Domain Routing", 
        "Analytics & Monitoring"
    ],
    "Uncategorized": [
        "Other"
    ]
}

# Create a reverse mapping from subcategory to category
subcategory_to_category = {}
for category, subcategories in categories.items():
    for subcategory in subcategories:
        subcategory_to_category[subcategory.lower()] = (category, subcategory)

# Initialize the hierarchy
hierarchy = defaultdict(lambda: defaultdict(list))

# Helper function to determine the category and subcategory of an issue
def categorize_issue(issue):
    title = issue['title'].lower()
    body = issue.get('body', '').lower() if issue.get('body') else ''
    
    # Check for specific patterns in title or body
    for subcategory_key, (category, subcategory) in subcategory_to_category.items():
        # Check if the subcategory name (without .do) is in the title or body
        clean_subcategory = subcategory_key.replace('.do', '')
        if clean_subcategory in title or subcategory_key in title or clean_subcategory in body or subcategory_key in body:
            return category, subcategory
    
    # Default to Uncategorized/Other if no match is found
    return "Uncategorized", "Other"

# Organize issues into the hierarchy
for issue in issues:
    # Skip pull requests
    if 'pull_request' in issue:
        continue
    
    category, subcategory = categorize_issue(issue)
    hierarchy[category][subcategory].append(issue)

# Generate the BACKLOG.md content
backlog_content = "# AI Primitives Backlog\n\n"
backlog_content += "This document organizes all open issues in the drivly/ai repository into a hierarchical structure, providing a comprehensive view of the current development backlog.\n\n"
backlog_content += "## Table of Contents\n\n"

# Generate table of contents
for category in sorted(hierarchy.keys()):
    backlog_content += f"- [{category}](#{category.lower().replace(' ', '-').replace('&', 'and')})\n"
    for subcategory in sorted(hierarchy[category].keys()):
        backlog_content += f"  - [{subcategory}](#{subcategory.lower().replace(' ', '-').replace('&', 'and').replace('.', '')})\n"

backlog_content += "\n"

# Generate the detailed sections
for category in sorted(hierarchy.keys()):
    backlog_content += f"## {category}\n\n"
    
    for subcategory in sorted(hierarchy[category].keys()):
        backlog_content += f"### {subcategory}\n\n"
        
        # Sort issues by number
        sorted_issues = sorted(hierarchy[category][subcategory], key=lambda x: x['number'])
        
        for issue in sorted_issues:
            issue_number = issue['number']
            issue_title = issue['title']
            issue_url = issue['html_url']
            
            # Extract labels
            labels = [label['name'] for label in issue.get('labels', [])]
            label_str = f" [{', '.join(labels)}]" if labels else ""
            
            backlog_content += f"- [#{issue_number}]({issue_url}): {issue_title}{label_str}\n"
        
        backlog_content += "\n"

# Write the BACKLOG.md file
with open('/workspace/ai/BACKLOG.md', 'w') as f:
    f.write(backlog_content)

print("BACKLOG.md has been generated successfully.")