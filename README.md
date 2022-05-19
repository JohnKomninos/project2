# project2 link: https://tranquil-shore-25531.herokuapp.com/NutritionIndex/

technologies: On the login page , I have the user either create a new account or login with an existing account. I then set the chosen account to active, and then query for the active page on each page the user heads to.  By doing this, I can retain and display any needed user info on each page. It also allows the user to have their own specific show page that will be unaffected by actions made by others users.
Other technologies:
   Built in logic to prevent duplicate naming of foods or usernames.
   added logic to implement a calorie calculator and calculate total calories depending on number of serving sizes.
   I have 2 separate Schemas so that users cannot modify my food schema but do have the option to modify and add foods on their own personal show page.

As written above, my main approach was to set users active / not active so each user could have their own personal page.

problems: my routes got a bit complex because of how many pages I included and because i included quite a few forms on various pages.
my query system isnt perfect. The site will run into problems if 2 users are active at the same time.

notes to myself: I would like to implement user authentication so I can avoid having to query for active on all pages and so that multiple users can view my page. I want to implement it on this project but I was running out of time.
