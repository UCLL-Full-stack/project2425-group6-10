import { User } from '../../model/user';

test('given: user with valid values, when: creating a new user, then: user is created', () => {
    const user = new User({
        username: 'JohnDoe',
        email: 'john.doe@gmail.com',
        password: 'John1234',
        role: 'student',
    });

    expect(user.getUsername()).toBe('JohnDoe');
    expect(user.getEmail()).toBe('john.doe@gmail.com');
    expect(user.getPassword()).toBe('John1234');
    expect(user.getRole()).toBe('student');
});

test('given: user with empty username, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: '',
            email: 'john.doe@gmail.com',
            password: 'John1234',
            role: 'student',
        });
    };

    expect(user).toThrow('Username is required');
});

test('given: user with only spaces in username, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: '       ',
            email: 'john.doe@gmail.com',
            password: 'John1234',
            role: 'student',
        });
    };

    expect(user).toThrow('Username is required');
});

test('given: user with empty email, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: '',
            password: 'John1234',
            role: 'student',
        });
    };

    expect(user).toThrow('Email is required');
});

test('given: user with only spaces in email, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: '       ',
            password: 'John1234',
            role: 'student',
        });
    };

    expect(user).toThrow('Email is required');
});

test('given: user with invalid email, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe.gmail.com',
            password: 'John1234',
            role: 'student',
        });
    };

    expect(user).toThrow('Email must be a valid email format.');
});

test('given: user with empty password, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: '',
            role: 'student',
        });
    };

    expect(user).toThrow('Password is required');
});

test('given: user with only spaces in password, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: '      ',
            role: 'student',
        });
    };

    expect(user).toThrow('Password is required');
});

test('given: user with password less than 8 characters, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: 'john123',
            role: 'student',
        });
    };

    expect(user).toThrow('Password must be at least 8 characters long');
});

test('given: user with empty role, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: 'john1234',
            role: '' as any,
        });
    };

    expect(user).toThrow('Role must be either admin, lecturer or student');
});

test('given: user with only spaces role, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: 'john1234',
            role: '     ' as any,
        });
    };

    expect(user).toThrow('Role must be either admin, lecturer or student');
});

test('given: user with invalid role, when: creating a new user, then: an error is thrown', () => {
    const user = () => {
        new User({
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: 'john1234',
            role: 'guest' as any,
        });
    };

    expect(user).toThrow('Role must be either admin, lecturer or student');
});
