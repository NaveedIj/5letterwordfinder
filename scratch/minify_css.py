import re
import sys

def minify_css(css):
    # Remove comments
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # Remove whitespace around selectors and properties
    css = re.sub(r'\s*([\{\};:,])\s*', r'\1', css)
    # Remove unnecessary whitespace
    css = re.sub(r'\s+', ' ', css)
    return css.strip()

if __name__ == "__main__":
    with open('style.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    minified = minify_css(content)
    
    with open('style.min.css', 'w', encoding='utf-8') as f:
        f.write(minified)
