Dependencies
------------

 - Backend: Ruby, Bundler
 - Frontend: npm


Running
-------

Starting the backend:

    cd backend
    bundle install
    rails db:migrate
    rails db:seed
    rails server --port 4000

Starting the frontend:

    cd frontend
    npm install
    ./node_modules/.bin/tailwind build src/App.tailwind.css -o src/App.css
    npm start
    open http://localhost:3000/

