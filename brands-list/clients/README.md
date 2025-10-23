# Images Folder

Place your image files here. They will be accessible via:

```
https://your-api-url.com/images/filename.jpg
```

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.svg`
- `.webp`
- `.ico`

## Example

If you place a file: `nike-logo.png` in this folder

Access it at: `https://your-api-url.com/images/nike-logo.png`

## Frontend Usage

### In HTML:

```html
<img src="https://your-api-url.com/images/nike-logo.png" alt="Nike Logo" />
```

### In React:

```jsx
<img src={`${API_URL}/images/nike-logo.png`} alt="Nike Logo" />
```

### In JavaScript:

```javascript
const imageUrl = "https://your-api-url.com/images/nike-logo.png";
document.getElementById("myImage").src = imageUrl;
```
