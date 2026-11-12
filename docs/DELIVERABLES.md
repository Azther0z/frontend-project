# Saint and Poom: required deliverables

Source of truth: PDFs in [pdf/](pdf/), checked on 12 November 2026. Group allocation: [Project_Topic_Assignment_02-957520-17922322178662.pdf](pdf/Project_Topic_Assignment_02-957520-17922322178662.pdf), page 1 assigns Saint and Poom to Project 2, Equipment Rental System.

## Submission checklist

Deadline: Wednesday 18 November 2026, 23:00 Bangkok time. Complete all three actions: submit through MCV, push the program to the team's GitHub repository, and deploy on Vercel.

- [ ] Working frontend in the Project Team GitHub repository.
- [ ] Working deployment on Vercel.
- [ ] MCV assignment `PROJECT SUBMISSION`: text answer includes team GitHub repository URL and Vercel URL.
- [ ] Attach the presentation slides to MCV. Include both URLs. A UI design link is optional.
- [ ] Attach a UI design file to MCV, for example, a Figma export. It must show a designed UI flow. Finished screens alone do not meet this requirement.
- [ ] Explain the team work division at the end of the presentation. GitHub contribution evidence is preferred. Prepare GitHub Insights > Contributors.

Source: [Project-Submission-Presentation-Instructions_6aecab16d9430.pdf](pdf/Project-Submission-Presentation-Instructions_6aecab16d9430.pdf), pages 1-2 and 4.

## Required system behavior

Source: [6901_Project_Topics-957520-17911698720803.pdf](pdf/6901_Project_Topics-957520-17911698720803.pdf), pages 1 and 3.

### Backend foundation

- [ ] Use provided backend: https://github.com/SWDevPrac2-69-1/PJ02-EquipmentRent.git.
- [ ] Set up MongoDB and configure backend MongoDB URI.
- [ ] Run backend locally and inspect API documentation at http://localhost:5000/api-docs.
- You can customize the backend and add features. Poom decides the backend hosting layout. See [deployment options](DEPLOYMENT-OPTIONS.md).

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

The supplied backend contract was inspected at commit `be18df9967be7e0a742b5a5ae25f07966dc4e1d4`. It accepts same-day rentals and rentals up to seven elapsed days. It uses UTC to set today's date. It hides deleted equipment but keeps rental history. These behaviors were checked in code, not in a runtime test. Payment, approval, stock reservation, and multi-equipment carts are not confirmed requirements.

## Presentation deliverables and logistics

- [ ] Book a presentation slot through Course Materials > Project Presentation Booking. Booking opens Friday 13 November 2026, 16:00. Own-group edits allowed until Tuesday 17 November, 23:00. Editing another group's entry costs five points.
- [ ] Prepare sample equipment and enough member requests for the admin demo after the member deletes one request.
- [ ] Present within seven minutes, followed by three minutes Q&A.
- [ ] Follow this journey: assigned problem and UI flow; member registration and validation; login; equipment browsing; create a request and try an invalid request; view, edit, and delete own requests; logout; admin login; view, edit, and delete any request; create equipment; optional extras; contribution evidence; Vercel deployment and URLs.
- [ ] Demonstrate the deployed application when deployed.
- [ ] All members wear student uniform and keep cameras on.
- [ ] Join Zoom at least 30 minutes early. An empty preceding slot can bring the presentation forward.
- Late penalty: one point per minute. Overtime penalty: 0.5 points per minute. Presentations are recorded.

Source: [submission/presentation instructions](pdf/Project-Submission-Presentation-Instructions_6aecab16d9430.pdf), pages 3-4. [Class orientation](pdf/00_ClassOrientation-957520-17859437725987.pdf), page 9, lists 19 November 2026 for Class 15 project presentations. These PDFs do not establish the group's slot. The 18 November night session is an exception. It requires a valid reason and prior notice to the instructor.

## Grading

- Project functions: 20%.
- Work quality: 5%.
- UX/UI: 3%.
- UI flow design documentation: 3%.
- Presentation and demo: 4%, including 1% for Vercel deployment.
- Total term project: 35%.
- Additional functionality: 2% extra credit, marked with an unexplained asterisk in the source.

Source: [submission/presentation instructions](pdf/Project-Submission-Presentation-Instructions_6aecab16d9430.pdf), page 1. The demo journey omits some equipment management tasks. The topic requirements still require equipment updates and deletes.

## Current status

The requirements and team roles are documented. The PDF move to `docs/pdf/` is complete. Frontend/backend scaffold, imports, and planned type files are not created. Read [FRONTEND-PLAN.md](FRONTEND-PLAN.md) for the agreed directory and component plan.
Read [CONTRIBUTION-HANDOFF.md](CONTRIBUTION-HANDOFF.md) for ownership and pending checks. Read [API.md](API.md) for backend details.

The [Figma draft](https://www.figma.com/design/llQS6sjdaGY3OpBfXf7NVh/Untitled?node-id=11-815) has eight main screens and two confirmation dialogs.
The layout was inspected on 12 November 2026. The prototype needs component and navigation repairs.
Full member and admin flows are not tested. The design export and MCV attachment are pending.

Application code, deployment, booking, and submission are not complete.

## Course-example references

These references guide implementation. The assignment requirements above define the required outcomes.

- [W07 Router Navigation](pdf/W07_Router_Navigation-957520-17888570978209.pdf): page 2, 12, 27-28 cover Next.js links and programmatic navigation.
- [W06 React State](pdf/W06_ReactState-957520-17883323524647.pdf): pages 7, 9, 18-19 cover component state and reducers. [W11 Redux](pdf/W11_Redux-957520-17919964134724.pdf) pages 13-15 cover Redux Toolkit if the team uses Redux. Redux is not a stated requirement.
- [W09 Data Fetching](pdf/W09_DataFetching-957520-17908413706988.pdf): pages 17-27 cover MongoDB Atlas project setup; pages 25-26 specify backend `MONGO_URI` and local port 5000.
- [W10 Data Posting](pdf/W10_DataPosting-957520-17913744221453.pdf): page 26 shows JSON POST requests.
- [W13 Testing](pdf/W13_Testing-957520-17617264035331.pdf) and [W14 TestingDeploy](pdf/W14_TestingDeploy-957520-17938047974877.pdf) contain testing workshops. The assignment does not set a test count or require a test framework.
- [W14 TestingDeploy](pdf/W14_TestingDeploy-957520-17938047974877.pdf): page 37 introduces Vercel deployment. The submission instructions also require the Vercel URL.

The application, deployment, and submission are not verified. This checklist does not authorize external publication.
