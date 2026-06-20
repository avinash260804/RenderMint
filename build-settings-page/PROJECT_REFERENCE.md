# Atelier Settings Page - Project Reference

## Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Home page
│   ├── globals.css             # Atelier theme colors (dark mode)
│   └── settings/
│       ├── layout.tsx          # Settings shell with sidebar & SaveBar
│       ├── page.tsx            # Redirect to /settings/profile
│       └── [section]/
│           ├── profile/        # Profile settings
│           ├── identity/       # Creative Identity settings
│           ├── account/        # Account & Security settings
│           ├── notifications/  # Notifications settings
│           ├── privacy/        # Privacy & Visibility settings
│           ├── feed/           # Feed & Discovery settings
│           ├── appearance/     # Appearance settings
│           ├── credits/        # Credits & Reputation settings
│           ├── connections/    # Connections settings
│           └── data/           # Data & Export settings
│
├── components/settings/
│   ├── SettingsSidebar.tsx     # Sidebar navigation (10 sections)
│   ├── SaveBar.tsx              # Sticky save/discard bar
│   ├── SettingsSection.tsx      # Section header wrapper
│   ├── SettingsRow.tsx          # Label + control row layout
│   ├── SettingsInput.tsx        # Text input with label, helper, counter
│   ├── ToggleSwitch.tsx         # Accessible toggle switch
│   ├── ToggleRow.tsx            # Toggle with label and description
│   ├── PillButton.tsx           # Primary/secondary/ghost buttons
│   └── ToastContainer.tsx       # Toast notification display
│
├── lib/
│   ├── toast.tsx               # Toast context & hooks
│   ├── constants.ts            # Settings sections, validation rules
│   └── types.ts                # TypeScript interfaces
│
└── Docs:
    ├── TEST_SUMMARY.md         # Complete test results
    └── PROJECT_REFERENCE.md    # This file
```

## Color System (Atelier Dark Theme)

All colors defined in `app/globals.css` as CSS custom properties:

```css
--background: #0a0a0a;              /* Deep black */
--foreground: #f5f5f5;              /* Light gray text */
--card: #1a1a1a;                    /* Card backgrounds */
--muted: #404040;                   /* Muted text/secondary elements */
--muted-foreground: #999999;        /* Muted text color */
--accent: #ff6b35;                  /* Orange - primary interactive color */
--border: #2a2a2a;                  /* Subtle borders */
--input: #1a1a1a;                   /* Input field backgrounds */
```

## Key Features

### 1. Form State Management
- Per-section state using React `useState`
- Dirty state detection by comparing current vs. initial values
- SaveBar only visible when `isDirty === true`
- Form submission triggers success toast

### 2. SaveBar Behavior
- Fixed position at bottom of viewport
- Shows "⚠ UNSAVED CHANGES" label
- Two buttons: "DISCARD" and "SAVE"
- Auto-clears after successful save
- Z-index: 40 (above content, below modals if added)

### 3. Toast Notifications
- Global ToastContext provider in settings layout
- Auto-dismiss after 3 seconds
- Success messages with green checkmark
- Error messages (if needed) appear in orange
- Position: bottom-right corner

### 4. Accessibility
- All form inputs wrapped with `<label>` or `aria-label`
- Toggle switches: `role="switch"` + `aria-checked`
- Proper heading hierarchy (h2, h3 per section)
- Color contrast: WCAG AA compliant
- Focus indicators: Orange ring on inputs
- Semantic HTML throughout

### 5. Responsive Design
- Desktop: Sidebar visible on left (width: 220px)
- Mobile: Sidebar hidden, content full width
- Breakpoint: `md` (768px) for sidebar show/hide
- SaveBar adjusts padding for mobile

## Component API

### SettingsInput
```tsx
<SettingsInput
  id="display-name"
  label="Display Name"
  helper="Your full name as shown to others"
  placeholder="Jane Doe"
  maxLength={50}
  counter={{ current: 0, max: 50 }}
  error={errors.displayName}
  value={formData.displayName}
  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
/>
```

### SettingsRow
```tsx
<SettingsRow
  label="Two-Factor Authentication"
  description="Add an extra layer of security"
  error={errors.twoFactor}
>
  <ToggleSwitch
    checked={formData.twoFA}
    onChange={(checked) => setFormData({...formData, twoFA: checked})}
  />
</SettingsRow>
```

### ToggleSwitch
```tsx
<ToggleSwitch
  id="compact-mode"
  checked={formData.compactMode}
  onChange={(checked) => setFormData({...formData, compactMode: checked})}
  aria-label="Enable compact mode"
/>
```

### PillButton
```tsx
<PillButton variant="primary" size="sm" onClick={handleSave}>
  Save Changes
</PillButton>

<PillButton variant="secondary" size="md">
  Discard
</PillButton>
```

## Integration Points (TODO)

### API Endpoints to Create
Each settings page has TODO comments for API integration:

```typescript
// Example: POST /api/settings/profile
const handleSave = async (data) => {
  const response = await fetch('/api/settings/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: session.user.id,  // From auth session
      ...data
    })
  })
  
  if (response.ok) {
    showToast('Profile updated successfully', 'success')
    setInitialData(data) // Reset dirty state
  }
}
```

### Session & Authentication
- Assumes authentication system provides `session.user.id`
- All API calls should include user ID for per-user data scoping
- Add to route handlers:
  ```typescript
  const session = await auth()
  if (!session?.user?.id) return Response.json({}, { status: 401 })
  // Then filter/validate that data belongs to current user
  ```

## Development Guidelines

### Adding a New Setting
1. Create new file in `app/settings/[sectionId]/page.tsx`
2. Add to `SETTINGS_SECTIONS` in `lib/constants.ts`
3. Use existing components: `SettingsSection`, `SettingsRow`, `SettingsInput`
4. Implement state management with `useState`
5. Add dirty state detection
6. Add TODO comments for API integration

### Styling
- Use Tailwind CSS with custom theme tokens
- Colors from CSS variables (accent, background, etc.)
- Typography: `font-mono` for labels, `font-sans` for body
- Spacing: `gap-4`, `p-6`, `mb-8` (Tailwind scale)
- No hardcoded colors - always use CSS variables

### Component Reusability
- Components in `components/settings/` are reusable across all sections
- Each component handles its own styling
- Props interface defined in component file
- All components use TypeScript for type safety

## Testing Checklist

- [ ] All 10 settings sections load and display correctly
- [ ] Form fields accept and store input
- [ ] Dirty state detection working (SaveBar appears on changes)
- [ ] Save button triggers toast notification
- [ ] Discard button reverts changes and hides SaveBar
- [ ] Navigation between sections preserves form state
- [ ] Responsive design works on mobile/tablet
- [ ] Accessibility: Tab navigation functional
- [ ] Toast notifications auto-dismiss after 3s
- [ ] All validation rules applied (if any)

## Performance Optimization Tips

1. **Memoization**: Use `React.memo()` for sidebar if it becomes large
2. **Input debouncing**: Debounce character counter updates
3. **Code splitting**: Dynamic imports for settings sections if needed
4. **Image optimization**: If adding images, use `next/image`
5. **CSS**: All styling uses Tailwind - no extra CSS to load

## Deployment Notes

1. Ensure environment variables are set for API endpoints
2. Database/backend ready to receive `/api/settings/*` requests
3. Authentication middleware in place for route handlers
4. Rate limiting on API endpoints recommended
5. Implement proper error handling for API failures
6. Add logging for debugging production issues

## Support & Troubleshooting

### Toast not showing?
- Check `ToastProvider` is in layout
- Verify `useToast()` hook is called in component

### Form not updating?
- Ensure state is initialized in `useState()`
- Check `onChange` handlers are connected
- Verify form values are controlled (value prop set)

### SaveBar not appearing?
- Confirm dirty state logic: `JSON.stringify(initial) !== JSON.stringify(current)`
- Check z-index isn't being overridden
- Verify bottom positioning in viewport

### Theme colors not applying?
- Check globals.css variables are loaded
- Verify `dark` class is on `<html>` element
- Ensure Tailwind CSS is processing custom tokens

## Future Enhancements

- [ ] Batch save multiple sections
- [ ] Undo/Redo functionality
- [ ] Local storage for draft recovery
- [ ] Form validation with inline error messages
- [ ] Success/error animations
- [ ] Settings search/filter
- [ ] Settings import/export
- [ ] Settings sync across devices
- [ ] Settings analytics
- [ ] Email verification for email changes

---

**Last Updated:** June 16, 2026
**Version:** 1.0 Complete
