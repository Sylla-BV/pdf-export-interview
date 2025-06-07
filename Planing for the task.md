Okay, first I have to understand the task:
It is simple: the user show see a button click on it and this button process a pdf and after the pdf is proccessed the user will be able to download the pdf for 120 seconds, after that the button can still show up but the download will not be possible.
Breaking in small tasks:
1. Create a page to show the button
2. Prepare the environment,
2.1 install qstack variables
2.2 install the database infraestructure
3. create an endpoint to send the pdf to the qstack
4. receive the response for the pdf
5. make the link apear on the screen (I will use two aproaches) first with the pooling and than with SSE
6. build the logic to invalidate the url
7. done?