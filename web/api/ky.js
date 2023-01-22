import ky from 'ky';

export default ky.create({
    prefixUrl: `${process.env.SERVER_API_HOST || ''}`,
});
