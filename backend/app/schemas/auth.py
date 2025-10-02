from pydantic import BaseModel, EmailStr

class RegisterIn(BaseModel):
    email: EmailStr
    password: str          # ✅ 요청 JSON은 password로 통일
    nickname: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str          # ✅ 로그인도 password

class UserOut(BaseModel):
    user_id: int
    email: EmailStr
    nickname: str
    role: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
