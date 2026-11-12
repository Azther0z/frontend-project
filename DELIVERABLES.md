# Saint and Poom: required deliverables

Source of truth: PDFs in this folder. Verified 12 November 2026. Group allocation: `Project_Topic_Assignment_02-957520-17922322178662.pdf`, page 1 assigns Saint and Poom to Project 2, Equipment Rental System.

## Submission checklist

Deadline: Wednesday 18 November 2026, 23:00 Bangkok time. All three actions must be complete: MCV submission, program pushed to the team's GitHub repository, and Vercel deployment.

- [ ] Working frontend in the Project Team GitHub repository.
- [ ] Working deployment on Vercel.
- [ ] MCV assignment `PROJECT SUBMISSION`: text answer includes team GitHub repository URL and Vercel URL.
- [ ] Presentation slide file attached to MCV. Slides include both URLs; may also include a UI design link.
- [ ] UI design file attached to MCV, such as a Figma export. It must represent a designed UI flow; arranging finished screens alone does not meet the stated requirement.
- [ ] Explain team work division at the end of the presentation. GitHub contribution evidence is preferred; prepare GitHub Insights > Contributors.

Source: `Project-Submission-Presentation-Instructions_6aecab16d9430.pdf`, pages 1-2 and 4.

## Required system behavior

Source: `6901_Project_Topics-957520-17911698720803.pdf`, pages 1 and 3.

### Backend foundation

- [ ] Use provided backend: https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent.git.
- [ ] Set up MongoDB and configure backend MongoDB URI.
- [ ] Run backend locally and inspect API documentation at http://localhost:5000/api-docs.
- Backend customization and additional functionality are permitted. Hosting details for a backend accessible by the Vercel frontend remain a design decision.

### Users and access

- [ ] Support admin and member roles.
- [ ] Register with name, email, tel, role, and password.
- [ ] Log in with email/password; support logout.
- [ ] Use the JWT credential issued after login.
- [ ] Integrate backend access control and protected routes.

### Equipment

- [ ] Everyone can view equipment, including visitors.
- [ ] Logged-in admins can add, view, update, and delete equipment.
- [ ] Equipment has name, category, description, available quantity, and rental rate.
- [ ] Use equipment ID for updates, deletes, and rental requests.

### Rental requests

- [ ] Logged-in members create requests with equipment ID, quantity, start date, and return date.
- [ ] Creating a request does not immediately change equipment quantity.
- [ ] Members view, edit, and delete their own requests.
- [ ] Admins manage any user's requests.
- [ ] Start date is today or later; return date is on or after start date.
- [ ] Requested quantity does not exceed available quantity.
- [ ] Maximum three units of the same equipment per request.
- [ ] Rental duration is at most seven days.

The supplied backend contract has been inspected at commit `be18df9967be7e0a742b5a5ae25f07966dc4e1d4`. It accepts same-day rentals and up to seven elapsed days between date strings, uses UTC for today, and hides deleted equipment while retaining rental history. These are verified code behaviors, not a completed runtime test. Do not assume payment, approval, stock reservation, or multi-equipment cart functionality is mandatory.

## Presentation deliverables and logistics

- [ ] Book a presentation slot through Course Materials > Project Presentation Booking. Booking opens Friday 13 November 2026, 16:00. Own-group edits allowed until Tuesday 17 November, 23:00. Editing another group's entry costs five points.
- [ ] Prepare sample equipment in advance, plus sufficient member requests for the admin demonstration after the member deletes a request.
- [ ] Present within seven minutes, followed by three minutes Q&A.
- [ ] Follow this journey: assigned problem and UI flow; member registration and validation; login; equipment browsing; request creation and an invalid-condition attempt; view own requests; edit own request; delete own request; logout; admin login; view any request; edit any request; delete any request; create equipment; optional extras; contribution evidence; Vercel deployment and URLs.
- [ ] Demonstrate the deployed application when deployed.
- [ ] All members wear student uniform and keep cameras on.
- [ ] Join Zoom at least 30 minutes early. An empty preceding slot can bring the presentation forward.
- Late penalty: one point per minute. Overtime penalty: 0.5 points per minute. Presentations are recorded.

Source: submission/presentation instructions, pages 3-4. Orientation page 9 lists 19 November 2026 for Class 15 project presentations. The actual group slot is not established by these PDFs. The 18 November night session is an exception requiring necessity and prior instructor notification.

## Grading

- Project functions: 20%.
- Work quality: 5%.
- UX/UI: 3%.
- UI flow design documentation: 3%.
- Presentation and demo: 4%, including 1% for Vercel deployment.
- Total term project: 35%.
- Additional functionality: 2% extra credit, marked with an unexplained asterisk in the source.

Source: submission/presentation instructions, page 1. The demo journey does not cover every equipment-management operation; the full topic requirements still require equipment update and delete.

## Session deliverables and current status

- Required deliverables inventory: checked against group allocation, topic specification, and submission instructions. Lecture review found implementation examples rather than additional final-project test-framework quotas.
- Confirmed project decisions: fresh frontend; required core before extras; member catalog → detail → login → request quantity/dates → submit → My Rentals view/edit/delete; admin Equipment CRUD and All Rentals view/edit/delete for any member. Requests leave stock unchanged; payment and approval are not part of the agreed flow. Saint owns public/auth/member work; Poom owns admin equipment, admin rentals, and backend/deployment preparation. Both contribute code, checks, and demo preparation. Stack: Next.js with TypeScript, based on course examples; English UI; start with plain semantic HTML within React and use Tailwind utilities directly in `className` if styling is needed.
- UI Flow Design: [Figma wireframe draft](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-815) contains 30 plain box screen states and prototype click navigation. Incomplete: MCP quota prevented removing the old diagram and fixing remaining registration fields/sample links. Requirements and contribution documentation stay in this repository. Design export and MCV attachment remain submission tasks.
- Contribution handoff: `CONTRIBUTION-HANDOFF.md` records these decisions and backend/API evidence. Auth persistence, shared setup details, and submission ownership remain unresolved. Detailed integration suggestions remain suggestions, not confirmed decisions.

## Course-example references

These references guide implementation choices; the assignment requirements above determine required outcomes.

- W07 Router Navigation: page 2, 12, 27-28 cover Next.js links and programmatic navigation.
- W06 React State: pages 7, 9, 18-19 cover component state and reducers. W11 Redux pages 13-15 cover Redux Toolkit when Redux is used; this is not evidence that Redux is compulsory.
- W09 Data Fetching: pages 17-27 cover MongoDB Atlas project setup; pages 25-26 specify backend `MONGO_URI` and local port 5000.
- W10 Data Posting: page 26 shows JSON POST requests.
- W13 Testing and W14 TestingDeploy contain testing workshops; no explicit final-project test count or framework mandate was identified.
- W14 TestingDeploy: page 37 introduces Vercel deployment. The submission instructions independently require the Vercel submission URL.

No application, deployment, or submission has been verified. No external publication is authorized by this checklist.
