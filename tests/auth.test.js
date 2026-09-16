require("dotenv").config({
    path: ".env.test",
});

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/User");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    // Wait for connection to be ready
    await new Promise(resolve => {
        if (mongoose.connection.readyState === 1) {
            resolve();
        } else {
            mongoose.connection.once('connected', resolve);
        }
    });
});

afterEach(async () => {
    try {
        await User.deleteMany({});
    } catch (error) {
        console.error("Error in afterEach:", error);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    // Force exit after a timeout to prevent Jest hanging
    setTimeout(() => process.exit(0), 1000);
});


describe("Auth Routes", () => {


    describe("POST /auth/sign-up", () => {


        test("creates a new user", async () => {

            const response = await request(app)
                .post("/auth/sign-up")
                .send({
                    name: "zaid",
                    email: "zaid@example.com",
                    password: "password123"
                });


            expect(response.statusCode).toBe(201);


            expect(response.body.email)
                .toBe("zaid@example.com");


            expect(response.body.hashedPassword)
                .toBeUndefined();

        });



        test("does not allow duplicate emails return 409", async () => {


            await User.create({
                name: "zaid",
                email: "zaid@example.com",
                hashedPassword: "hashedpassword"
            });


            const response = await request(app)
                .post("/auth/sign-up")
                .send({
                    name: "zaid",
                    email: "zaid@example.com",
                    password: "password123"
                });


            expect(response.statusCode)
                .toBe(409);


            expect(response.body.message)
                .toBe("Email already exists");

        });

        test("does not allow signup when missing name, email or password", async () => {



            const response = await request(app)
                .post("/auth/sign-up")
                .send({
                    name: "zaid",
                });


            expect(response.statusCode)
                .toBe(400);


            expect(response.body.message)
                .toBeDefined()

        });


    });



    describe("POST /auth/sign-in", () => {


        beforeEach(async () => {

            await User.create({
                name: "zaid",
                email: "zaid@example.com",
                hashedPassword: "$2b$12$LQv3c1y8f5k7H5x..."
            });

        });



        test("requires email and password", async () => {


            const response = await request(app)
                .post("/auth/sign-in")
                .send({
                    email: "zaid@example.com"
                });


            expect(response.statusCode)
                .toBe(400);


            expect(response.body.message)
                .toBe(
                    "Email and password are required."
                );

        });



        test("rejects invalid email", async () => {


            const response = await request(app)
                .post("/auth/sign-in")
                .send({
                    email: "doesnotexist@example.com",
                    password: "password123"
                });


            expect(response.statusCode)
                .toBe(401);


            expect(response.body.message)
                .toBe(
                    "Invalid credentials."
                );

        });



        test("rejects incorrect password", async () => {


            const response = await request(app)
                .post("/auth/sign-in")
                .send({
                    email: "zaid@example.com",
                    password: "wrongpassword"
                });


            expect(response.statusCode)
                .toBe(401);


            expect(response.body.message)
                .toBe(
                    "Invalid credentials."
                );

        });



    });


});
