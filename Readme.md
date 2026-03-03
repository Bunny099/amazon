# Amazon Backend MVP

A minimal transactional backend inspired by core e-commerce order logic.

Built to model atomic checkout, inventory reservation, and safe order cancellation.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- Zod
- JWT

## Features

- User registration & login (Customer / Seller)
- Seller product management
- Inventory management (available / reserved)
- Customer cart
- Atomic checkout (transactional)
- Order cancellation with inventory restoration

## Core Guarantees

- Inventory never goes negative
- Checkout is atomic
- Order price is snapshotted at purchase time
- Cancel restores reserved stock safely
- Invalid state transitions fail

## What Is Not Included

- Payments
- Shipping
- Refund system
- Notifications
- Frontend
- Microservices

## Run Locally

```bash
pnpm install
docker compose up -d
pnpm prisma migrate dev
pnpm run dev