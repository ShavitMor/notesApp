"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const notesRoutes_1 = __importDefault(require("./routes/notesRoutes"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/api', notesRoutes_1.default);
app.get('/', (req, res) => {
    res.send('API is running...');
});
//im gonna try http://localhost:3500/api/notes?id=121 with axios, dont forget add token
axios_1.default.get('http://localhost:3500/api/notes', {
    params: {
        id: '66c4a6048b',
    },
    headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzM2MDRiNzcwMzM3YzM3YjIyYjkwYSIsImlhdCI6MTcyNDE2MzQwNCwiZXhwIjoxNzI0MTY3MDA0fQ.yXeNRmvvrR7AQYypGNp009JsURXuaLvhGHe0nG-0yxM`,
    },
})
    .then(response => {
    console.log(response.data);
})
    .catch(error => {
    console.error(error);
});
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
