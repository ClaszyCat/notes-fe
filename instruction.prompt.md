Please read the instructions from the file `notes-be/instruction.prompt.md` and read about the api contract in that file.
Use that for APIs Services generation in this project.

Learn my current note application in `notes-fe` folder ( my package / library that i used ), and integrate the APIs Services to my current note application.

Use this APIs Library to consume APIs for Frontend:

- React Query
- Axios
- Universal Cookie

In my Frontend Side aka `notes-fe` folder, I want to use `axios` for making API calls, firstly create axios class custom that already include header Bearer from cookies and baseURL from environment variable, and requirement from api contract in `notes-be/instruction.prompt.md` file.

Create the Frontend Services structure like in bellow:

```src
└── services
    ├── api
    │   ├── axiosClient.ts
    │   └── index.ts
    └── modules
        ├── authService.ts
        ├── noteService.ts
        └── userService.ts
└── interfaces
    ├── auth.ts
    ├── note.ts
    └── user.ts
```

So Integrate all the services/modules in my current note application, and create a middleware if user already login or auth, store the token in cookies, and if user already login, redirect to `/notes` page, and if user not login, redirect to `/login` page.
Use React Query for data fetching, caching, synchronizing, and updating the server state in my React application.
