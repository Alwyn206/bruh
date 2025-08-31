/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Discord-like color palette
        discord: {
          // Dark theme colors
          'dark-primary': '#36393f',
          'dark-secondary': '#2f3136',
          'dark-tertiary': '#202225',
          'dark-quaternary': '#18191c',
          
          // Text colors
          'text-primary': '#ffffff',
          'text-secondary': '#b9bbbe',
          'text-muted': '#72767d',
          'text-link': '#00b0f4',
          
          // Accent colors
          'blurple': '#5865f2',
          'blurple-dark': '#4752c4',
          'green': '#3ba55d',
          'yellow': '#faa81a',
          'red': '#ed4245',
          'orange': '#ff6b35',
          
          // Interactive colors
          'interactive-normal': '#b9bbbe',
          'interactive-hover': '#dcddde',
          'interactive-active': '#ffffff',
          'interactive-muted': '#4f545c',
          
          // Background colors
          'bg-primary': '#36393f',
          'bg-secondary': '#2f3136',
          'bg-tertiary': '#202225',
          'bg-accent': '#4f545c',
          'bg-floating': '#18191c',
          'bg-mobile-primary': '#36393f',
          'bg-mobile-secondary': '#2f3136',
          
          // Channel colors
          'channel-default': '#8e9297',
          'channel-hover': '#dcddde',
          'channel-selected': '#ffffff',
          'channel-unread': '#ffffff',
          
          // Status colors
          'status-online': '#3ba55d',
          'status-idle': '#faa81a',
          'status-dnd': '#ed4245',
          'status-offline': '#747f8d',
        },
        
        // Additional custom colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      
      fontFamily: {
        'sans': ['Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'display': ['Ginto', 'Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'mono': ['Consolas', 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', 'Monaco', 'Courier New', 'Courier', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      boxShadow: {
        'discord': '0 2px 10px 0 rgba(0, 0, 0, 0.2)',
        'discord-lg': '0 8px 16px rgba(0, 0, 0, 0.24)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}