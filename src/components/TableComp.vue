<template>
  <!-- table header -->
  <div class="wrapper-header">
    <p>환자 데이터</p>
    <div>
      <span>Show : </span>

      <el-select
        @change="paginateEntries"
        v-model="currentEntries"
        class="m-2"
        placeholder="Select"
      >
        <el-option v-for="option in showEntries" :key="option" :value="option">
          {{ option }}
        </el-option>
      </el-select>
    </div>
  </div>

  <!-- table -->
  <el-table
    :data="filteredEntries"
    @expand-change="fetchPatient"
    class="wrapper-table"
  >
    <el-table-column type="expand">
      <template #default="props">
        <ul v-if="expandedPatient[`${props.row.personID}`]" class="detail">
          <li>
            전체 방문 수 :
            {{ expandedPatient[`${props.row.personID}`].visitCount }}
          </li>

          <li>
            진단 정보 :
            <div
              v-for="(item, index) in expandedPatient[`${props.row.personID}`]
                .conditionList"
              :key="index"
            >
              - {{ item }}
            </div>
          </li>
        </ul>
      </template>
    </el-table-column>
    <el-table-column prop="personID" label="personID" sortable>
    </el-table-column>
    <el-table-column
      prop="gender"
      label="gender"
      sortable
      :filters="filterOptions.gender"
      :filter-method="filterHandler"
    >
    </el-table-column>
    <el-table-column prop="birthDatetime" label="birthDatetime" sortable>
    </el-table-column>
    <el-table-column prop="age" label="age" sortable></el-table-column>
    <el-table-column
      prop="race"
      label="race"
      sortable
      :filters="filterOptions.race"
      :filter-method="filterHandler"
    >
    </el-table-column>
    <el-table-column
      prop="ethnicity"
      label="ethnicity"
      sortable
      :filters="filterOptions.ethnicity"
      :filter-method="filterHandler"
    >
    </el-table-column>
    <el-table-column prop="isDeath" label="isDeath" sortable> </el-table-column>
  </el-table>

  <!-- table show -->
  <div class="wrapper-show">
    <div>Show {{ showInfo.from }} to {{ showInfo.to }}</div>
  </div>

  <!-- table pagination -->
  <div class="wrapper-pagination">
    <ul class="nav">
      <li class="{ 'disabled': currentPage ==== 1 }">
        <el-button @click.prevent="currentPage = 1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
              d="M31.1 64.03c-17.67 0-31.1 14.33-31.1 32v319.9c0 17.67 14.33 32 32 32C49.67 447.1 64 433.6 64 415.1V96.03C64 78.36 49.67 64.03 31.1 64.03zM267.5 71.41l-192 159.1C67.82 237.8 64 246.9 64 256c0 9.094 3.82 18.18 11.44 24.62l192 159.1c20.63 17.12 52.51 2.75 52.51-24.62v-319.9C319.1 68.66 288.1 54.28 267.5 71.41z"
            />
          </svg>
        </el-button>
      </li>
      <li
        v-for="page in showPagination"
        :key="page"
        :class="{ ellipsis: page === '...', active: page === currentPage }"
      >
        <el-button @click.prevent="paginateEvent(page)">
          {{ page }}
        </el-button>
      </li>
      <li class="{ 'disabled': currentPage ==== 1 }">
        <el-button @click.prevent="(currentPage = allPages), paginateEntries()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
              d="M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z"
            />
          </svg>
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { $array } from 'alga-js';
import requestMixin from '@/mixins/requestMixin';
export default {
  name: 'TableComp',
  mixins: [requestMixin],
  data() {
    return {
      tablePatient: [],
      tablePage: 2,
      tablePageSize: 10,
      columns: [
        { name: 'personID', text: '환자 ID' },
        { name: 'gender', text: '성별' },
        { name: 'birthDatetime', text: '생년월일' },
        { name: 'age', text: '나이' },
        { name: 'race', text: '인종' },
        { name: 'ethnicity', text: '민족' },
        { name: 'isDeath', text: '사망 여부' }
      ],
      entries: [],
      showEntries: [5, 10, 15, 20, 25, 50, 100, 999],
      currentEntries: 10,
      filteredEntries: [],
      currentPage: 1,
      allPages: 1,
      filterOptions: {},
      expandedPatient: {}
    };
  },
  created() {
    this.fetchList().then((res) => {
      this.entries = res;
      this.paginateData(this.entries);
    });
    this.fetchFilter().then((res) => {
      console.log(res);
      this.filterOptions = {
        gender: this.filterOptionsMap(res.gender),
        race: this.filterOptionsMap(res.race),
        ethnicity: this.filterOptionsMap(res.ethnicity)
      };
    });
  },
  computed: {
    pagedTableData() {
      return this.tablePatient.slice(
        this.tablePage * this.tablePageSize - this.tablePageSize,
        this.tablePage * this.tablePageSize
      );
    },
    showInfo() {
      return $array.show(this.entries, this.currentPage, this.currentEntries);
    },
    showPagination() {
      const result = $array.pagination(this.allPages, this.currentPage, 3);
      console.log(result);
      return result;
    }
  },
  methods: {
    async fetchList() {
      const url = '/patient/list';
      const result = await this.fetchData('get', url);
      console.log(result, 'patients');
      return result.patient.list;
    },
    async fetchFilter() {
      // Gender
      const urlGender = '/gender/list';
      const resultGender = await this.fetchData('get', urlGender);
      // Race
      const urlRace = '/race/list';
      const resultRace = await this.fetchData('get', urlRace);
      // Ethnicity
      const urlEthnicity = '/ethnicity/list';
      const resultEthnicity = await this.fetchData('get', urlEthnicity);
      return {
        gender: resultGender.genderList,
        race: resultRace.raceList,
        ethnicity: resultEthnicity.ethnicityList
      };
    },
    async fetchPatient(row) {
      const id = row.personID;
      const urlPatient = `/patient/brief/${id}`;
      const resultPatient = await this.fetchData('get', urlPatient);
      if (!this.expandedPatient[id]) {
        console.log('dd');
        this.expandedPatient[id] = resultPatient;
      }
      console.log(this.expandedPatient);
    },
    paginateEvent(page) {
      console.log(page, this.currentPage);
      this.currentPage = page;
      console.log(page, this.currentPage);
      this.paginateEntries();
    },
    paginateData(data) {
      this.filteredEntries = $array.paginate(
        data,
        this.currentPage,
        this.currentEntries
      );
      this.allPages = $array.pages(data, this.currentEntries);
    },
    paginateEntries() {
      this.paginateData(this.entries);
    },
    filterOptionsMap(arr) {
      console.log(arr);
      return arr.map((property) => {
        return {
          text: property,
          value: property
        };
      });
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper-header {
  display: flex;
  justify-content: space-between;
  p {
    font-size: 2rem;
    font-weight: bold;
  }
  div {
    width: 16rem;
    display: flex;
    align-items: center;
    span {
      font-size: 1.2rem;
      white-space: pre;
    }
    .el-select {
      flex-basis: max-content;
    }
  }
}

.wrapper-table {
  width: 100%;
  .detail {
    padding: 1.6rem 3.6rem;
  }
}
.wrapper-show {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}
.wrapper-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  .nav {
    display: flex;
    padding-left: 0;
    list-style: none;
    margin: 0;
    .disabled {
      color: #6c757d;
      pointer-events: none;
      background-color: #fff;
      border-color: #dee2e6;
    }
    .ellipsis {
      color: #6c757d;
      pointer-events: none;
      background-color: #fff;
      border-color: #dee2e6;
    }
    .el-button {
      svg {
        min-height: 1rem;
      }
    }
  }
}
</style>
