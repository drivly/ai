---
title: Building a React Hook: useLocalStorage
output: react-hook-tutorial.mp4
fps: 30
resolution:
  width: 1920
  height: 1080
transition: fade
---

layout: intro
background: "#282c34"
voiceover: Welcome to this tutorial on building a custom React hook for local storage. We'll create a reusable hook that simplifies working with browser storage.

# Building a Custom React Hook
## useLocalStorage Implementation

---

layout: default
background: "#282c34"
voiceover: Custom hooks are a powerful feature in React that let us extract component logic into reusable functions.

# Custom Hooks in React

- Begin with "use" prefix (convention)
- Encapsulate stateful logic and side effects
- Can call other hooks
- Share logic between components

---

layout: slideshow
code: |
  import { useState } from 'react';

  function useLocalStorage(key, initialValue) {
    // Initialize state here
  }
steps:
  - |
    import { useState } from 'react';

    function useLocalStorage(key, initialValue) {
      // Initialize state here
    }
  - |
    import { useState } from 'react';

    function useLocalStorage(key, initialValue) {
      // Initialize our state
      const [storedValue, setStoredValue] = useState(() => {
        try {
          // Get from local storage by key
          const item = window.localStorage.getItem(key);
          // Return parsed JSON or initialValue
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });
    }
  - |
    import { useState } from 'react';

    function useLocalStorage(key, initialValue) {
      // Initialize our state
      const [storedValue, setStoredValue] = useState(() => {
        try {
          // Get from local storage by key
          const item = window.localStorage.getItem(key);
          // Return parsed JSON or initialValue
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });

      // Define setter function that updates state and localStorage
      const setValue = (value) => {
        try {
          // Allow value to be a function
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;
          // Save state
          setStoredValue(valueToStore);
          // Save to local storage
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(error);
        }
      };

      return [storedValue, setValue];
    }
language: javascript
voiceover: Let's build our hook step by step. We'll start with the basic structure, then add initialization from localStorage, and finally implement the setter function.
---

layout: default
background: "#282c34"
voiceover: Now that we've implemented our hook, let's see it in action with a simple component example.

# Using Our Custom Hook

```jsx
function UserProfile() {
  const [user, setUser] = useLocalStorage('user', { name: '', theme: 'light' });

  const updateName = (event) => {
    setUser({ ...user, name: event.target.value });
  };

  const toggleTheme = () => {
    setUser({ ...user, theme: user.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className={`profile ${user.theme}`}>
      <input value={user.name} onChange={updateName} placeholder="Your name" />
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

---

layout: slideshow
code: |
  function useLocalStorage(key, initialValue) {
    // Our hook implementation
  }
steps:
  - |
    function useLocalStorage(key, initialValue) {
      const [storedValue, setStoredValue] = useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });

      const setValue = (value) => {
        try {
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(error);
        }
      };

      return [storedValue, setValue];
    }
  - |
    function useLocalStorage(key, initialValue) {
      const [storedValue, setStoredValue] = useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });

      const setValue = (value) => {
        try {
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(error);
        }
      };

      // Add effect to sync with localStorage changes
      useEffect(() => {
        const handleStorageChange = (event) => {
          if (event.key === key) {
            setStoredValue(JSON.parse(event.newValue));
          }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
      }, [key]);

      return [storedValue, setValue];
    }
  - |
    function useLocalStorage(key, initialValue) {
      const [storedValue, setStoredValue] = useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });

      const setValue = (value) => {
        try {
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(error);
        }
      };

      // Add effect to sync with localStorage changes
      useEffect(() => {
        const handleStorageChange = (event) => {
          if (event.key === key) {
            setStoredValue(JSON.parse(event.newValue));
          }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
      }, [key]);

      // Add remove function
      const remove = () => {
        try {
          window.localStorage.removeItem(key);
          setStoredValue(initialValue);
        } catch (error) {
          console.error(error);
        }
      };

      return [storedValue, setValue, remove];
    }
language: javascript
voiceover: Let's enhance our hook to handle synchronization across tabs and add a remove function, making it more robust for real-world applications.
---

layout: cover
background: "#21232b"
voiceover: That's it! You've created a powerful custom React hook that makes working with local storage easier and more reliable.

# Summary

- Created a custom React hook for local storage
- Implemented state initialization from storage
- Added synchronized updates to localStorage
- Enhanced the hook with cross-tab synchronization
- Added a removal function for complete control

## Thanks for following along!
