# UI flows

Status: Saint-confirmed draft, pending Poom review. Native Figma click-through checked on November 12, 2026. These checks cover sample UI interactions, not a running application.

[Open the design](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled) or [start the prototype](https://www.figma.com/proto/llQS6sjdaGY3OpBfXf7NVh/Untitled?page-id=0%3A1&node-id=11-815&starting-point-node-id=11%3A815&scaling=min-zoom&content-scaling=fixed).

## Eight reusable screens

| Screen | Main actions |
|---|---|
| [Equipment Catalog](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-815) | Browse equipment; open details or Account. |
| [Equipment Details](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-841) | Switch Camera/Tripod sample; log in to request or open Rental Form. |
| [Account](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-861) | Log in or register; show errors inline. |
| [Rental Form](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-1098) | Create or edit a rental; show validation and success inline. |
| [My Rentals](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-1177) | View own requests inline; edit or delete. |
| [Admin Equipment](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-1274) | View equipment inline; add, edit or delete. |
| [Equipment Form](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-1304) | Reuse Add, Edit Camera and Edit Tripod tabs. |
| [Admin Rentals](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-1402) | View any member request inline; edit or delete. |

Two small confirmation dialogs handle equipment and rental deletion. Internal component definitions hold sample states; they are not extra user screens.

## Core paths and check receipt

Each row below passed a manual native-prototype check. A pass means the stated destination or feedback appeared.

| Path checked | Observed result |
|---|---|
| Catalog → Details → Camera/Tripod tabs → Catalog | Details changed inline; back returned to Catalog. |
| Account → empty Login | Inline email/password error; Account stayed open. |
| Account → sample member → Login | My Rentals opened. |
| Account → sample admin → Login | Admin Equipment opened. |
| Details → Account → sample member → Log in & request | Rental Form opened. |
| Account → Register → fill sample member → Create account | My Rentals opened without a separate login step. |
| Account → Register → fill sample → choose admin → Create account | Admin Equipment opened without a separate login step. |
| Rental Form → invalid sample → Create request | Quantity and date errors appeared inline; form stayed open. |
| Rental Form → valid sample → Create request → Go to My Rentals | Inline success appeared; My Rentals opened. |
| My Rentals → View → Hide | Details opened and closed inline. |
| My Rentals → Edit → Save edits → return | Inline success appeared; returned to My Rentals. |
| My Rentals → Delete → Cancel / Confirm | Rental dialog opened; either action closed it. |
| Admin Equipment → View | Equipment details appeared inline. |
| Admin Equipment → Add → empty Save | Inline validation appeared. |
| Equipment Form → fill Add sample → Save → back | Inline added feedback appeared; returned to Admin Equipment. |
| Admin Equipment → Edit → select Edit Camera → Save → back | Inline saved feedback appeared; returned to Admin Equipment. |
| Admin Equipment → Delete → Cancel / Confirm | Equipment dialog opened; either action closed it. |
| Admin Rentals → View member request | Selected sample details appeared inline. |
| Admin Rentals → Edit → Save edits → return | Inline success appeared; returned to Admin Rentals. |
| Admin Rentals → Delete → Cancel / Confirm | Rental dialog opened; either action closed it. |
| Member/admin list → Log out | Catalog opened. |

The Account design starts on Login. When the prototype retains an earlier tab state, click the Login tab or restart the prototype.

## Prototype limits and implementation requirements

- Clicking fields selects prepared sample values. It does not enter real credentials, call an API, or save data. Confirming deletion closes the dialog; the sample record remains.
- Shared screen tabs select the example item and create/edit mode manually. The prototype does not carry the selected item ID automatically. The application must carry the actual equipment/rental ID and preserve the pending member request through login or registration.
- The shared Rental Form displays sample member/admin navigation together. The application must show role-specific navigation and use the access rules in [API.md](API.md). Admins cannot create rentals.
- Inline validation and success examples are present. Complete loading, empty, network failure, expired-session and access-denied behavior still needs implementation and testing.
- These checks are not proof of backend authorization, real form validation, persistent changes, session restoration, mobile layout or deployment.

Poom should review the flows with [POOM-REVIEW.md](POOM-REVIEW.md). UI flow export for MCV, final visual review and application integration tests remain pending.
