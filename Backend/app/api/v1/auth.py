from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.auth import Token, UserCreate, UserResponse
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user_email,
)
from app.core.logging import logger

router = APIRouter()

# ---------------------------------------------------------------------------
# NOTE: In production, replace this in-memory store with a real User table
# query via UserRepository.  The mock below keeps the MVP functional while
# the real auth flow is wired correctly (hashed passwords, real JWT, etc.).
# ---------------------------------------------------------------------------
_MOCK_USERS: dict[str, dict] = {
    "admin@iiros.com": {
        "id": "mock-admin-id",
        "email": "admin@iiros.com",
        "full_name": "Admin User",
        "role": "admin",
        "is_active": True,
        # bcrypt hash of "admin" — replace with real password in production
        "hashed_password": get_password_hash("admin"),
    }
}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    if user_in.email in _MOCK_USERS:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    new_user = {
        "id": f"user-{len(_MOCK_USERS) + 1}",
        "email": user_in.email,
        "full_name": user_in.full_name,
        "role": user_in.role,
        "is_active": True,
        "hashed_password": get_password_hash(user_in.password),
    }
    _MOCK_USERS[user_in.email] = new_user
    logger.info("user_registered", email=user_in.email)
    return {k: v for k, v in new_user.items() if k != "hashed_password"}


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    user = _MOCK_USERS.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        logger.warning("login_failed", username=form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    logger.info("login_success", email=user["email"])
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_email: str = Depends(get_current_user_email)):
    user = _MOCK_USERS.get(current_email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {k: v for k, v in user.items() if k != "hashed_password"}