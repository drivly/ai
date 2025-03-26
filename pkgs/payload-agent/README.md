# ChatBot

Can be used as a panel, modal or resizable.

## Panel

```tsx
<ChatBot logo="/DrivlyLogo.svg" type="panel" withOverlay withOutsideClick />
```

## Modal

```tsx
<ChatBot logo="/DrivlyLogo.svg" type="modal" withOverlay withOutsideClick />
```

## Resizable

needs to wrap your entire app in order to work.

```tsx
<ChatBot logo="/DrivlyLogo.svg" type="resizable" direction="horizontal">
  <div>
    <h1>Main Application</h1>
  </div>
</ChatBot>
```
