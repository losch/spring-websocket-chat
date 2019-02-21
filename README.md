# Websocket chat application

Just for trying out Spring's websocket features. Backend is Spring boot with Kotlin and frontend is a React application created with create-react-app.

![Screenshot](./screenshots/screenshot.png?raw=true)

## Usage

1.  Add production configuration properties file
/backend/src/main/resources/application-prod.properties

websocket=wss://mydomain.com

2. Build everything

./mvnw package

3. Run the package

java -jar bundle/target/bundle-0.0.1-SNAPSHOT.jar -Dspring.profiles.active=prod

## Running in development mode

Run in one terminal: ./mvnw spring-boot:run -Dskip.tests -pl backend
And in another terminal in frontend directory: yarn start

Spring devtools are included so Spring should reload changes on compilation. Frontend code uses hot reloading automatically.
