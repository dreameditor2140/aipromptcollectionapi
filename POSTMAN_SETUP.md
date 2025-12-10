# Postman Collection Setup Guide

This guide will help you set up and use the Postman collection for the AI Prompt API.

## 📥 Importing the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `postman_collection.json` from the project root
5. Click **Import**

## 🔧 Environment Setup

### Create Environment Variables

1. In Postman, click on **Environments** (left sidebar)
2. Click **+** to create a new environment
3. Name it "AI Prompt API - Local" (or any name you prefer)
4. Add the following variables:

| Variable Name | Initial Value | Current Value |
|--------------|---------------|---------------|
| `base_url` | `http://localhost:5000` | `http://localhost:5000` |
| `anon_token` | (leave empty) | (auto-filled) |
| `admin_token` | (leave empty) | (auto-filled) |
| `anon_tokenId` | (leave empty) | (auto-filled) |
| `admin_id` | (leave empty) | (auto-filled) |
| `admin_username` | (leave empty) | (auto-filled) |
| `admin_role` | (leave empty) | (auto-filled) |
| `last_image_id` | (leave empty) | (auto-filled) |

5. Click **Save**
6. Select this environment from the dropdown (top right)

## 🔑 Automatic Token Management

The collection includes **automatic token management scripts**:

### For Anonymous Users:
- **Pre-request Script**: Automatically creates/refreshes anonymous token if not set
- **Test Script**: Saves token to environment variable after successful authentication

### For Admin Users:
- **Pre-request Script**: Automatically logs in and gets admin token if not set
- **Test Script**: Saves token and admin details to environment variables

**Note**: Admin login uses hardcoded credentials (vishrut/2140). You can modify this in the pre-request scripts if needed.

## 📋 Collection Structure

### 1. Authentication
- **Create Anonymous Token** - Creates anonymous user token
- **Admin Login** - Login as admin (vishrut/2140)

### 2. Public Endpoints
- Health Check
- Test Endpoint
- List Categories
- List Prompts
- Get Prompt Detail
- Get Image

### 3. User Endpoints (Anonymous)
- Generate Prompt
- Get Favorites
- Add to Favorites
- Remove from Favorites

### 4. Image Upload (Admin)
- Upload Single Image
- Upload Multiple Images
- Delete Image

### 5. Admin Endpoints
- Get Admin Statistics
- List All Prompts (Admin)
- Create Prompt (Admin)
- Delete Prompt (Admin)
- Create Category (Admin)
- Update Category (Admin)
- Delete Category (Admin)
- Create Admin (Super Admin Only)
- List All Admins (Super Admin Only)

## 🚀 Quick Start

### Step 1: Start the Server
```bash
npm start
```

### Step 2: Get Anonymous Token
1. Open **Authentication** folder
2. Run **Create Anonymous Token**
3. Token is automatically saved to `anon_token` variable

### Step 3: Get Admin Token
1. Open **Authentication** folder
2. Run **Admin Login**
3. Token is automatically saved to `admin_token` variable

### Step 4: Test Endpoints
- All endpoints will automatically use the saved tokens
- No need to manually add Authorization headers (they're pre-configured)

## 📝 Using the Collection

### For Anonymous User Endpoints:
1. Make sure you've run **Create Anonymous Token** first
2. The token is automatically included in requests
3. If token expires, just run **Create Anonymous Token** again

### For Admin Endpoints:
1. Make sure you've run **Admin Login** first
2. The token is automatically included in requests
3. If token expires, the pre-request script will auto-login

### For Image Upload:
1. Use **Upload Single Image** or **Upload Multiple Images**
2. Select image file(s) in the Body > form-data section
3. The uploaded image ID is automatically saved to `last_image_id`
4. You can use this ID in other requests

## 🔄 Token Refresh

Tokens are automatically refreshed by pre-request scripts:
- **Anonymous tokens**: Created automatically if missing
- **Admin tokens**: Login automatically if missing

## 🛠️ Customization

### Change Base URL:
1. Update `base_url` environment variable
2. Or modify the collection variable

### Change Admin Credentials:
1. Open any admin endpoint
2. Go to **Pre-request Script** tab
3. Modify the username/password in the login request

### Disable Auto-Login:
1. Remove or comment out the pre-request scripts
2. Manually set tokens in environment variables

## 📊 Environment Variables Reference

| Variable | Description | Auto-Set By |
|----------|-------------|-------------|
| `base_url` | API base URL | Manual |
| `anon_token` | Anonymous user JWT token | Create Anonymous Token |
| `admin_token` | Admin JWT token | Admin Login |
| `anon_tokenId` | Anonymous user token ID | Create Anonymous Token |
| `admin_id` | Admin user ID | Admin Login |
| `admin_username` | Admin username | Admin Login |
| `admin_role` | Admin role (admin/superAdmin) | Admin Login |
| `last_image_id` | Last uploaded image ID | Upload Image |

## 🐛 Troubleshooting

### Token Not Working:
1. Check if token is set in environment variables
2. Run the authentication endpoint again
3. Check server logs for errors

### Auto-Login Not Working:
1. Verify base_url is correct
2. Check server is running
3. Verify admin credentials are correct

### Image Upload Failing:
1. Check file size (max 10MB)
2. Verify file type (JPEG, PNG, GIF, WebP)
3. Check Cloudinary credentials in .env file

## 📚 Additional Notes

- All tokens are stored in environment variables
- Tokens persist across requests in the same session
- You can view/manage tokens in Postman's environment panel
- Collection includes example request bodies for all endpoints
- Variable placeholders (like `{{base_url}}`) are automatically replaced

## 🎯 Example Workflow

1. **Start Server**: `npm start`
2. **Import Collection**: Import `postman_collection.json`
3. **Set Environment**: Create and select environment
4. **Get Tokens**: Run authentication endpoints
5. **Test API**: Use any endpoint - tokens are auto-included!

Happy Testing! 🚀

