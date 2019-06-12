# Django를 사용한 rest api 개발

## 설치
```bash
pip install pip install django-rest-swagger
pip install pip install djangorestframework
pip install django-cors-headers
```

## Project 구성
```bash
django-admin startproject planner_django_api .
```

## Project test
```bash
python manage.py runserver 0:8080
```

## Create App
```bash
python manage.py startapp planner
```

## model 추가 방법
* `<your-app>/models.py` 파일을 수정 후 `<project-main>/settings.py` 파일의 INSTALLED_APPS 리스트에 `<your-app>.apps.<Your-app>Config`를 추가한다(Config 이름은 `<your-app>/app.py` 파일 참고).
  
## model 추가 후 db에 테이블 추가 방법
```bash
python manage.py makemigrations <your-app>
python manage.py migrate
```

## Django shell 사용법
* Django shell은 일반 python shell과 유사하지만 django 환경변수와 relative path를 그대로 사용할 수 있는 장점이 있다.
```bash
python manage.py shell
```

## Django shell에서 객체 생성 및 db에 추가
```python
from <your-app>.models import <Object>

obj = <Object>(your-parameters)
obj.save()
```

## Django shell 에서 객체 조회
```python
from <your-app>.models import <Object>

<Object>.objects.all()
```

## 관리자 계정 만들기
```bash
python manage.py createsuperuser
```

## 관리 페이지에 해당 객체 등록
* `<your-app>/admin.py` 페이지에서 `admin.site.register(<Object>)` 를 호출