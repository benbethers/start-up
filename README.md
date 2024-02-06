# Rating

## Specification Deliverable

### Elevator Pitch

All across the country countless college students get into dorms and sign up for professors and go to businesses around the area, all things that come with starting or continuing college. However, the problem is that these college students do not know the quality of these roommates, teachers, or businesses. this rating application will allow the student to keep their user login safe and will also allow the user to view ratings from other users on experiences they have had with roommates, professors, or businesses that the current user may need information on. Furthermore, the student will be able add their own ratings to help out their fellow users. The application will help these new college students know what they are walking into before hand and equip them with the knowledge they need to make all preparations accordingly, knowing the history of these professors, businesses, and roommates.

### Design

![](~/assets/images/One.jpg)
![](~/assets/images/Two.jpg)

Here is an example of how the users interact with the server, rate other users, and view other user's ratings

![Here is an example of how the users interact with the server, rate other users, and view other user's ratings](~/assets/images/Three.jpg)

### Key Features

- Secure login over HTTPS
- Ability of users to rate businesses, roommates, and teachers
- Display profiles and ratings of other users
- Ability of a user to view their own ratings
- Ratings are persistently stored
- Ability for admin to delete ratings by users

### Technologies

I am going to use the required technologies in the following ways.
- HTML - Uses correct HTML structure for application. Four HTML pages. One for login, one for adding a rating, one for viewing a rating, and one for searching a rating. Hyperlinks to choice artifact.
- CSS - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- JavaScript - Provides login, star rating display, applying user, display other users ratings, backend endpoint calls
- Service - Backend service with endpoints for:
    - login
    - retrieving ratings from a user
    - retrieving ratings for a user
    - submitting ratings
- DB/Login - Store user credentials, ratings for that user, and ratings given by that user in the database. Register and login users. Credentials securely stored in database. Can't rate unless verified and authenticated.
- WebSocket - All ratings given by users are broadcast to all other users.
- React - Application ported to use the React web framework.

## HTML Deliverable
For this deliverable I built out the structure of my application using HTML.

- HTML pages - Two HTML page that represent the ability to login and vote.
- Links - The login page automatically links to the voter page. The voter page contains links for every voting choice.
- Text - Each of the voting choices is represented by a textual description.
- Images - I couldn't figure out how to include an image and so I didn't do this. 😔
- DB/Login - Input box and submit button for login. The voting choices represent data pulled from the database.
- WebSocket - The count of voting results represent the tally of realtime votes
