# Clasp Website

A static company website built with HTML, CSS, and JavaScript, with content management powered by Netlify CMS.

## Features

- **Static Site**: Pure HTML, CSS, and JavaScript - no build step required
- **Content Management**: Netlify CMS for easy content updates
- **Responsive Design**: Mobile-friendly layout
- **GitHub Integration**: Content stored in the repository as JSON files

## Project Structure

```
/
├── index.html              # Main page
├── css/
│   └── main.css           # Styles
├── js/
│   └── main.js            # Content loader
├── content/               # CMS-editable content (JSON files)
│   ├── hero.json
│   ├── about.json
│   ├── services.json
│   └── contact.json
├── admin/
│   ├── index.html         # Netlify CMS interface
│   └── config.yml         # CMS configuration
└── static/                # Static assets (images, etc.)
    └── images/
```

## Local Development

### Running Locally

1. **Using a simple HTTP server** (recommended):
   ```bash
   npx serve .
   ```
   Then open `http://localhost:3000` in your browser.

2. **Using Python**:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

3. **Using Node.js http-server**:
   ```bash
   npx http-server
   ```

### Testing Netlify CMS Locally

To test the CMS locally, you'll need to run the Netlify CMS proxy server:

```bash
npx netlify-cms-proxy-server
```

Then update `admin/config.yml` to use the local backend:

```yaml
backend:
  name: git-gateway
  branch: main
```

Or keep it as `github` and use GitHub authentication.

## Deployment

### GitHub Setup

1. Create a new repository on GitHub (e.g., `Clasp-website`)
2. Push this code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/Clasp-website.git
   git push -u origin main
   ```

### Netlify Setup

1. **Create a Netlify account** and go to your dashboard
2. **Add new site** → **Import from Git** → Select your GitHub repository
3. **Build settings**:
   - Build command: (leave empty or use `echo "No build"`)
   - Publish directory: `/` (or the directory containing `index.html`)
   - Branch: `main`

4. **Enable Netlify Identity**:
   - Go to **Site settings** → **Identity**
   - Click **Enable Identity**
   - Under **Registration preferences**, set to **Invite only** (recommended)
   - Under **External providers**, you can enable **GitHub** for easier authentication

5. **Enable Git Gateway** (if using Identity):
   - Go to **Site settings** → **Identity** → **Services** → **Git Gateway**
   - Click **Enable Git Gateway**

6. **Update CMS Config**:
   - Edit `admin/config.yml`
   - Update the `repo` field with your actual GitHub username/org and repository name:
     ```yaml
     backend:
       name: github
       repo: your-username/Clasp-website
       branch: main
     ```

### Accessing the CMS

Once deployed, access the CMS at:
- `https://your-site.netlify.app/admin/`

The first time you visit, you'll need to:
1. Sign up or log in (if using Identity)
2. Authorize with GitHub (if using GitHub OAuth)
3. Start editing content!

## Content Management

All content is stored in JSON files under the `content/` directory:
- `content/hero.json` - Hero section content
- `content/about.json` - About section content
- `content/services.json` - Services/features list
- `content/contact.json` - Contact information and social links

When you edit content through Netlify CMS, changes are committed directly to your GitHub repository, which triggers a new deployment on Netlify.

## Customization

### Styling

Edit `css/main.css` to customize colors, fonts, and layout. CSS variables are defined at the top of the file for easy theming.

### Adding New Sections

1. Create a new JSON file in `content/` (e.g., `content/testimonials.json`)
2. Add a corresponding collection in `admin/config.yml`
3. Update `index.html` to include the new section
4. Update `js/main.js` to load and display the new content

## License

All rights reserved.
