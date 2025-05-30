import os
import glob
import re
import json
from datetime import datetime

def extract_field(content, field_name):
    """Extract a field value from the content using regex."""
    # Match both single and double quoted values
    pattern = rf'{field_name}:\s*[\'"]([^\'"]*)[\'"]'
    match = re.search(pattern, content)
    if match:
        return match.group(1)
    return "N/A"

def extract_list_field(content, field_name):
    """Extract a list field value from the content using regex."""
    pattern = rf'{field_name}:\s*\[(.*?)\]'
    match = re.search(pattern, content)
    if match:
        # Parse the list items
        items_str = match.group(1).strip()
        if not items_str:
            return []
        # Extract quoted strings
        items = re.findall(r'"([^"]*)"', items_str)
        return items
    return []

def parse_file(file_path):
    """Parse a file and extract relevant fields."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Check if this is a registration file
            if "name:" in content:
                return {
                    'type': 'registration',
                    # Personal Information
                    'name': extract_field(content, 'name'),
                    'description': extract_field(content, 'description'),
                    'contact_method': extract_field(content, 'contact_method'),
                    'contact': extract_field(content, 'contact'),
                    'wallet_address': extract_field(content, 'wallet_address'),
                    'role': extract_field(content, 'role'),
                    'experience_level': extract_field(content, 'experience_level'),
                    'timezone': extract_field(content, 'timezone'),
                    # Team Information
                    'team_name': extract_field(content, 'team_name'),
                    'team_status': extract_field(content, 'team_status'),
                    'project_name': extract_field(content, 'project_name'),
                    'project_description': extract_field(content, 'project_description'),
                    # Additional Information
                    'tech_stack': extract_field(content, 'tech_stack'),
                    'support_needed': extract_field(content, 'support_needed'),
                    'goals': extract_field(content, 'goals'),
                    'notes': extract_field(content, 'notes'),
                    'file_path': file_path
                }
            else:
                print(f"Unknown file type: {file_path}")
                return None
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return None

def scan_registration_files():
    """Scan the registration directory for markdown files."""
    registration_dir = os.path.join(os.getcwd(), 'registration')
    if not os.path.exists(registration_dir):
        print(f"Registration directory not found: {registration_dir}")
        return []
        
    files = glob.glob(os.path.join(registration_dir, '*.md'))
    # Exclude template.md
    return [f for f in files if not f.endswith('template.md')]

def update_participants_table(registrations):
    """Update only the participants table in the README file."""
    readme_path = os.path.join(os.getcwd(), 'README.md')
    
    # Generate participants table with original columns
    participants_table = "| Name | Role | Team Status | Project Name | Project Description | Contact |\n|------|------|-------------|--------------|--------------------|---------|\n"

    for reg in registrations:
        name = reg.get('name', 'N/A')
        role = reg.get('role', 'N/A')
        team_status = reg.get('team_status', 'N/A')
        project_name = reg.get('project_name', 'N/A')
        project_description = reg.get('project_description', 'N/A')
        contact = reg.get('contact', 'N/A')
        contact_method = reg.get('contact_method', 'N/A')
        file_path = reg.get('file_path', '')

        # Create a link to the registration file
        md_link = name
        if file_path and name != 'N/A':
            filename = os.path.basename(file_path)
            md_link = f'[{name}](./registration/{filename})'

        # Format contact with method if available
        contact_display = contact
        if contact_method != 'N/A' and contact != 'N/A':
            contact_display = f'{contact} ({contact_method})'
        
        # Escape pipe characters in description to avoid breaking the table
        project_description = project_description.replace('|', '&#124;') if project_description else 'N/A'

        participants_table += f"| {md_link} | {role} | {team_status} | {project_name} | {project_description} | {contact_display} |\n"
    
    try:
        # Read the existing README file
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the participants section and replace it
        pattern = r'(## 👥 Participants)\s+([\s\S]*?)(?=\n##|\Z)'
        match = re.search(pattern, content)
        
        if match:
            # Replace just the participants section with exactly two newlines after the heading
            # followed by the participants table
            updated_content = re.sub(
                pattern,
                r'\1' + f"\n\n{participants_table}",
                content
            )
            
            # Update the last updated timestamp
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            updated_content = re.sub(
                r'\*Last updated: .*\*',
                f"*Last updated: {timestamp}*",
                updated_content
            )
            
            # Write the updated content back to the file
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
                
            print(f"Updated participants table in README.md")
            return True
        else:
            print("Could not find participants section in README.md")
            return False
    except Exception as e:
        print(f"Error updating README: {e}")
        return False


def update_hackathon():
    """Update the hackathon README with registration information."""
    # Process registration files
    registration_files = scan_registration_files()
    registrations = []
    for file in registration_files:
        data = parse_file(file)
        if data and data['type'] == 'registration':
            registrations.append(data)
    
    # Update only the participants table in the README
    update_participants_table(registrations)
    print(f"Updated README with {len(registrations)} participants.")
    return True

if __name__ == '__main__':
    update_hackathon()
