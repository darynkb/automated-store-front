# Troubleshooting Guide

## Common Development Issues

### Camera and QR Scanner Issues

#### Camera Permission Denied
**Problem:** QR scanner shows "Camera access denied" error.

**Solutions:**
1. **Check browser permissions:**
   - Chrome: Click the camera icon in address bar → Allow
   - Firefox: Click the shield icon → Permissions → Camera → Allow
   - Safari: Safari menu → Settings → Websites → Camera → Allow

2. **HTTPS requirement:**
   - Camera access requires HTTPS in production
   - Use `https://localhost:3000` for local testing
   - Or test on actual mobile device with local network IP

3. **Browser compatibility:**
   - Ensure browser supports `getUserMedia` API
   - Update to latest browser version
   - Test in different browsers

#### QR Codes Not Scanning
**Problem:** QR scanner doesn't detect valid QR codes.

**Solutions:**
1. **Lighting conditions:**
   - Ensure good lighting
   - Avoid glare and shadows
   - Clean camera lens

2. **QR code quality:**
   - Use high contrast QR codes (black on white)
   - Ensure QR code is not damaged or distorted
   - Test with different QR code generators

3. **Camera focus:**
   - Hold device steady
   - Maintain appropriate distance (6-12 inches)
   - Wait for camera to auto-focus

4. **Code format:**
   - Verify QR code contains valid URL or text
   - Test with simple text QR codes first

### Device Detection Issues

#### Wrong Interface Displayed
**Problem:** Mobile device shows desktop interface or vice versa.

**Solutions:**
1. **Clear browser cache:**
   ```bash
   # Chrome DevTools
   F12 → Application → Storage → Clear site data
   ```

2. **Check user agent:**
   - Open browser DevTools → Console
   - Type: `navigator.userAgent`
   - Verify device detection logic

3. **Manual override:**
   - Add `?interface=mobile` or `?interface=desktop` to URL
   - Use for testing specific interfaces

4. **Responsive design testing:**
   - Use browser DevTools device emulation
   - Test with actual devices when possible

### API and Network Issues

#### API Calls Failing
**Problem:** Mock API endpoints returning errors or not responding.

**Solutions:**
1. **Check development server:**
   ```bash
   npm run dev
   # Ensure server is running on correct port
   ```

2. **Verify API routes:**
   - Check `src/app/api/` directory structure
   - Ensure route files are properly named
   - Check for TypeScript errors

3. **Network tab debugging:**
   - Open DevTools → Network tab
   - Monitor API requests and responses
   - Check for 404 or 500 errors

4. **CORS issues:**
   - Usually not an issue with Next.js API routes
   - Check if accessing from different domain

#### Slow API Responses
**Problem:** Mock API responses are too slow or too fast.

**Solutions:**
1. **Adjust mock delays:**
   ```typescript
   // In mock API files
   await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
   ```

2. **Check system performance:**
   - Monitor CPU and memory usage
   - Close unnecessary applications
   - Restart development server

### Build and Deployment Issues

#### Build Failures
**Problem:** `npm run build` fails with errors.

**Solutions:**
1. **TypeScript errors:**
   ```bash
   npm run type-check
   # Fix all TypeScript errors before building
   ```

2. **ESLint errors:**
   ```bash
   npm run lint
   npm run lint:fix
   ```

3. **Dependency issues:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Memory issues:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

#### Production Deployment Issues
**Problem:** App works in development but fails in production.

**Solutions:**
1. **Environment variables:**
   - Ensure all required env vars are set
   - Check `NEXT_PUBLIC_` prefix for client-side vars

2. **Static file paths:**
   - Use relative paths for assets
   - Check `next.config.js` configuration

3. **API routes:**
   - Verify API routes work in production build
   - Check serverless function limits

### Performance Issues

#### Slow Page Loading
**Problem:** Pages load slowly or show loading states too long.

**Solutions:**
1. **Bundle analysis:**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   # Add to next.config.js and analyze bundle size
   ```

2. **Image optimization:**
   - Use Next.js Image component
   - Optimize image sizes and formats
   - Implement lazy loading

3. **Code splitting:**
   - Use dynamic imports for heavy components
   - Implement route-based code splitting

4. **Caching:**
   - Enable browser caching
   - Use service workers if needed

#### Memory Leaks
**Problem:** Browser becomes slow or crashes after extended use.

**Solutions:**
1. **Component cleanup:**
   ```typescript
   useEffect(() => {
     const timer = setInterval(() => {}, 1000);
     return () => clearInterval(timer); // Cleanup
   }, []);
   ```

2. **Event listener cleanup:**
   ```typescript
   useEffect(() => {
     const handler = () => {};
     window.addEventListener('resize', handler);
     return () => window.removeEventListener('resize', handler);
   }, []);
   ```

3. **State management:**
   - Avoid storing large objects in state
   - Clean up unused state
   - Use proper dependency arrays

### Testing Issues

#### Tests Failing
**Problem:** Jest tests fail or don't run properly.

**Solutions:**
1. **Mock setup:**
   ```typescript
   // In jest.setup.js
   Object.defineProperty(window, 'matchMedia', {
     writable: true,
     value: jest.fn().mockImplementation(query => ({
       matches: false,
       media: query,
       onchange: null,
       addListener: jest.fn(),
       removeListener: jest.fn(),
     })),
   });
   ```

2. **Camera mocking:**
   ```typescript
   Object.defineProperty(navigator, 'mediaDevices', {
     writable: true,
     value: {
       getUserMedia: jest.fn().mockResolvedValue({}),
     },
   });
   ```

3. **Component testing:**
   - Wrap components with required providers
   - Mock external dependencies
   - Use proper async/await for async operations

#### Test Coverage Issues
**Problem:** Low test coverage or missing test cases.

**Solutions:**
1. **Identify untested code:**
   ```bash
   npm run test:coverage
   # Check coverage report for missing areas
   ```

2. **Add integration tests:**
   - Test complete user flows
   - Test component interactions
   - Test error scenarios

3. **Mock external services:**
   - Mock API calls
   - Mock browser APIs
   - Mock third-party libraries

### Development Environment Issues

#### Hot Reload Not Working
**Problem:** Changes don't reflect automatically in browser.

**Solutions:**
1. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C) and restart
   npm run dev
   ```

2. **Check file watchers:**
   - Ensure files are saved properly
   - Check if IDE is interfering
   - Try hard refresh (Ctrl+Shift+R)

3. **Port conflicts:**
   ```bash
   # Use different port
   npm run dev -- -p 3001
   ```

#### IDE Integration Issues
**Problem:** TypeScript errors not showing in IDE or incorrect IntelliSense.

**Solutions:**
1. **Restart TypeScript service:**
   - VS Code: Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server"

2. **Check workspace settings:**
   - Ensure TypeScript version matches project
   - Check if multiple TypeScript versions installed

3. **Extension conflicts:**
   - Disable conflicting extensions
   - Update IDE and extensions

## Debug Tools

### Browser DevTools
1. **Console:** Check for JavaScript errors and warnings
2. **Network:** Monitor API calls and responses
3. **Application:** Check localStorage, sessionStorage, and service workers
4. **Performance:** Profile app performance and identify bottlenecks
5. **Lighthouse:** Audit performance, accessibility, and SEO

### React DevTools
1. **Components:** Inspect component hierarchy and props
2. **Profiler:** Identify performance issues in React components

### Debug Panel
The app includes a built-in debug panel (development only):
- Click the 🐛 button in bottom-right corner
- View logs, API calls, and state changes
- Export logs for debugging

### Logging
Use the debug utilities for detailed logging:
```typescript
import { debug } from '@/lib/debug';

debug.info('Component', 'User action performed', { userId: 123 });
debug.error('API', 'Request failed', error);
```

## Getting Help

### Documentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development setup guide
- [COMPONENTS.md](./COMPONENTS.md) - Component documentation
- [API.md](./API.md) - API documentation

### Community Resources
- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs

### Reporting Issues
When reporting issues, include:
1. **Environment details** (OS, browser, Node.js version)
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Console errors** and logs
5. **Screenshots** if applicable

### Debug Information
Use the debug panel to export logs:
1. Open debug panel (🐛 button)
2. Click "Export" to download debug information
3. Include exported file when reporting issues