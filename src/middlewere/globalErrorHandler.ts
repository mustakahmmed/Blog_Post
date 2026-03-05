import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

function errorHandler (
    err:any,
    req:Request,
    res:Response,
    next:NextFunction) {
  let statusCode = 500;
  let errorMessage = "Internal server error";
  let errorDetail = err

// PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "you provide Incorrect fild type or missing fild"
  }

  // PrismaClientKnownRequestError
  else if(err instanceof Prisma.PrismaClientKnownRequestError){
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found"
    }
    else if(err.code === "P2002"){
      statusCode = 400;
      errorMessage = "Unique constraint failed"
    }
    else if(err.code === "P2003"){
      statusCode = 400;
      errorMessage = "Foreign key constraint failed"
    }
  }

// PrismaClientUnknownRequestError
else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
  statusCode = 500;
  errorMessage = "Error occurred during query execution"
}

// PrismaClientRustPanicError
else if (err instanceof Prisma.PrismaClientRustPanicError) {
  statusCode = 500;
  errorMessage = "indicates that the underlying Prisma Query Engine has crashed (panicked) and exited with a non-zero exit code"
}

// PrismaClientInitializationError
else if (err instanceof Prisma.PrismaClientInitializationError) {
  if (err.errorCode === "P1000") {
    statusCode = 401;
    errorMessage = "Authentication failed, Please provide valid database credentials"
  }
  else if (err.errorCode === "P1001") {
    statusCode = 500;
    errorMessage = "Can't reach database server, Please make sure your database server is running"
  }
}

  res.status(statusCode)
  res.json({
    message:errorMessage,
    deta:errorDetail
  })
}

export default errorHandler;
