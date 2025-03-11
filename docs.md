# Dracula Drones Website Documentation

## Initial Setup
1. Copy `js/config.template.js` to `js/config.js`
2. Update access keys in `config.js`
3. Make sure `config.js` is in your `.gitignore`

## Password Protection
- Protected pages use a simple access key system
- Keys are stored in `js/config.js` (not tracked in git)
- Template available in `config.template.js`
- Features:
  - Password visibility toggle
  - Session storage to remember access
  - Protected content hidden until authenticated

## Image Gallery & Lightbox
- Gallery images use a grid layout
- Lightbox features:
  - Click image to open in lightbox
  - Title displayed above image
  - Close with 'X' or clicking outside
  - "Open in New Tab" button for full resolution
- Styling matches vampire theme

## Adding a New Project
1. Create new directory in `houses/[project-name]`
2. Copy template from `templates/update-template.html`
3. Update meta tags and content
4. Add project to `house.json`
5. To add password protection:
  - Add project key to `config.js`
  - Copy password overlay from template
  - Add required scripts

## Adding Project Updates
1. Create new file in `houses/[project-name]/updates/`
2. Name format: `YYYY-MM-DD-phase.html`
3. Update timeline navigation in all project files
4. Update `house.json` with new status

## Image Guidelines
- Thumbnails: 800x600px
- Gallery images: 1920x1080px
- File naming: descriptive-name.jpg
- Gallery structure:
  ```html
  <div class="gallery-item">
      <img src="path/to/image.jpg" alt="Description">
      <h3 class="gallery-title">Image Title</h3>
  </div>
  ```

## Required Scripts
For protected pages with galleries:
```html
<script src="../../../js/config.js"></script>
<script src="../../../js/password-protection.js"></script>
<script src="../../../scripts.js"></script>
``` 