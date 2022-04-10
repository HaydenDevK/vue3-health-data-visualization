import axios from 'axios';

const requestMixin = {
  methods: {
    async fetchData(method, url, params) {
      const res = await axios[method](`http://49.50.167.136:9871/api${url}`, {
        params
      });
      return res.data;
    }
  }
};

export default requestMixin;
