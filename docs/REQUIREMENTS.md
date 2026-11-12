# System requirements

The system lets visitors browse equipment, members request rentals, and admins manage equipment and rental requests.

## Accounts and access

- The system supports member and admin roles.
- Registration collects name, email, telephone number, role, and password.
- Users log in with email and password and can log out.
- Protected requests use the JWT credential from login. A JWT is a signed token that identifies a user.
- The backend enforces role and ownership rules for protected actions.

## Equipment

- Everyone can view equipment, including visitors who do not log in.
- Admins can add, view, update, and delete equipment.
- Each item has a name, category, description, available quantity, and rental rate.
- Updates, deletion, and rental requests identify equipment by its ID.

## Rental requests

- Members can create requests for one equipment item.
- Each request includes an equipment ID, quantity, start date, and return date.
- Creating a request does not change equipment quantity.
- Members can view, edit, and delete their own requests.
- Admins can view, edit, and delete any member request.
- Only members can create rental requests.

## Rental limits

- Quantity must be a whole number from one to three.
- Quantity cannot exceed the available quantity of the selected equipment.
- The start date must be today or later.
- The return date must be on or after the start date.
- The rental duration cannot exceed seven days.

The supplied backend uses UTC for today. It accepts same-day rentals and dates exactly seven elapsed days apart.
Each request uses the available quantity independently. Requests do not reserve stock.
Deleted equipment leaves the public catalog. Existing rental requests remain readable and deletable.

## Sources

The [project topic](pdf/6901_Project_Topics-957520-17911698720803.pdf), pages 1 and 3, defines the required behavior.
The [group allocation](pdf/Project_Topic_Assignment_02-957520-17922322178662.pdf), page 1, assigns Saint and Poom to Project 2.
The [API guide](API.md) describes the supplied backend and its exact field names and limits.
