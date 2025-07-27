import { NextFunction, Request, Response } from "express";

type AsyncControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

const asyncHandler =
    (fn: AsyncControllerType): AsyncControllerType =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export default asyncHandler;
