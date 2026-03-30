<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telescope Login</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0f172a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 2.5rem;
            width: 100%;
            max-width: 400px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
        }

        .logo svg {
            width: 36px;
            height: 36px;
        }

        .logo span {
            color: #f1f5f9;
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: 0.02em;
        }

        h1 {
            color: #f1f5f9;
            font-size: 1.125rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        p.subtitle {
            color: #64748b;
            font-size: 0.875rem;
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.25rem;
        }

        label {
            display: block;
            color: #94a3b8;
            font-size: 0.8125rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        input {
            width: 100%;
            padding: 0.625rem 0.875rem;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            color: #f1f5f9;
            font-size: 0.9375rem;
            transition: border-color 0.15s;
            outline: none;
        }

        input:focus {
            border-color: #6366f1;
        }

        input.error {
            border-color: #ef4444;
        }

        .error-msg {
            color: #f87171;
            font-size: 0.8125rem;
            margin-top: 0.4rem;
        }

        .alert {
            background: #450a0a;
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            color: #fca5a5;
            font-size: 0.875rem;
            margin-bottom: 1.5rem;
        }

        button[type="submit"] {
            width: 100%;
            padding: 0.75rem;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9375rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
            margin-top: 0.5rem;
        }

        button[type="submit"]:hover {
            background: #4f46e5;
        }

        .footer {
            text-align: center;
            margin-top: 1.5rem;
            color: #475569;
            font-size: 0.8125rem;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="logo">
            <!-- Telescope icon -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z" stroke="#6366f1" stroke-width="2"
                    stroke-linejoin="round" />
                <path d="M9 4V17M15 7V20" stroke="#6366f1" stroke-width="2" />
            </svg>
            <span>Laravel Telescope</span>
        </div>

        <h1>Sign in to continue</h1>
        <p class="subtitle">
            Please enter your email and password to access the Telescope dashboard.
        </p>

        @if ($errors->any())
            <div class="alert">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('telescope.login.post') }}">
            @csrf

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}" placeholder="admin@example.com"
                    class="{{ $errors->has('email') ? 'error' : '' }}" autofocus required />
                @error('email')
                    <div class="error-msg">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="••••••••"
                    class="{{ $errors->has('password') ? 'error' : '' }}" required />
                @error('password')
                    <div class="error-msg">{{ $message }}</div>
                @enderror
            </div>

            <button type="submit">
                Sign In
            </button>
        </form>

        <div class="footer">
            Laravel Telescope &mdash; Debugging Assistant for Laravel
        </div>
    </div>
</body>

</html>