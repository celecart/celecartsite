import re

# Read the file
with open('shared/data.ts', 'r') as f:
    content = f.read()

# Find all celebrity-brand connections for deleted celebrities (15, 18, 40)
lines = content.split('\n')
new_lines = []
skip_until_closing = False
brace_count = 0

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if this is the start of a celebrity connection to remove
    if ('celebrityId: 15,' in line or 
        ('celebrityId: 18,' in line and 'Kendall' in line) or 
        'celebrityId: 40,' in line):
        
        # Skip this entire object until we find the closing brace
        skip_until_closing = True
        brace_count = 0
        
        # Count opening braces in previous lines to understand depth
        j = i - 1
        while j >= 0 and not lines[j].strip().startswith('{'):
            j -= 1
        
        # Skip the opening brace line and all content until closing
        while i < len(lines):
            current_line = lines[i]
            
            # Count braces to find the end of this object
            brace_count += current_line.count('{')
            brace_count -= current_line.count('}')
            
            i += 1
            
            # When we reach balance and find a closing brace, we're done
            if brace_count <= 0 and '}' in current_line:
                break
        
        # Skip any trailing comma
        if i < len(lines) and lines[i].strip() == ',':
            i += 1
            
        continue
    
    new_lines.append(line)
    i += 1

# Write back the cleaned content
with open('shared/data.ts', 'w') as f:
    f.write('\n'.join(new_lines))

print("Removed all celebrity-brand connections for deleted celebrities")
