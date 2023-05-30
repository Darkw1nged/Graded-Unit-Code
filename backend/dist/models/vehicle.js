"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MySqlConnector = __importStar(require("../utils/mysql.connector"));
class VehicleDAO {
    get(registration_number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM vehicles WHERE registration_number = ?', [registration_number]);
                return rows[0];
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM vehicles');
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    getAllByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('SELECT * FROM vehicles WHERE user_id = ?', [user_id]);
                return rows;
            }
            catch (error) {
                console.log(error);
            }
            return null;
        });
    }
    create(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('INSERT INTO vehicles (registration_number, user_id, make, model, colour) VALUES (?, ?, ?, ?, ?)', [vehicle.getRegistrationNumber(), vehicle.getUserID(), vehicle.getMake(), vehicle.getModel(), vehicle.getColour()]);
                console.log('[Server]: vehicle created, ', vehicle.registration_number);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    update(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('UPDATE vehicles SET make = ?, model = ?, colour = ? WHERE registration_number = ?', [vehicle.make, vehicle.model, vehicle.colour, vehicle.registration_number]);
                console.log('[Server]: vehicle updated, ', vehicle.registration_number);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    delete(registration_number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield MySqlConnector.getPool();
                const [rows] = yield pool.query('DELETE FROM vehicles WHERE registration_number = ?', [registration_number]);
                console.log('[Server]: vehicle deleted, ', registration_number);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
class Vehicle {
    constructor(registration_number, user_id, make, model, colour) {
        this.registration_number = registration_number;
        this.user_id = user_id;
        this.make = make;
        this.model = model;
        this.colour = colour;
    }
    getRegistrationNumber() {
        return this.registration_number;
    }
    getUserID() {
        return this.user_id;
    }
    getMake() {
        return this.make;
    }
    getModel() {
        return this.model;
    }
    getColour() {
        return this.colour;
    }
    setRegistrationNumber(registration_number) {
        this.registration_number = registration_number;
    }
    setUserID(user_id) {
        this.user_id = user_id;
    }
    setMake(make) {
        this.make = make;
    }
    setModel(model) {
        this.model = model;
    }
    setColour(colour) {
        this.colour = colour;
    }
    static get(registration_number) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new VehicleDAO().get(registration_number);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new VehicleDAO().getAll();
        });
    }
    static getAllByUserID(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new VehicleDAO().getAllByUserID(user_id);
        });
    }
    static create(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new VehicleDAO().create(vehicle);
        });
    }
    static update(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new VehicleDAO().update(vehicle);
        });
    }
    static delete(registration_number) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new VehicleDAO().delete(registration_number);
        });
    }
}
exports.default = Vehicle;
