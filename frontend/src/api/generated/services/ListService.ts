/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MahasiswaListElement } from '../models/MahasiswaListElement';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ListService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * List mahasiswa asuh yang dapat dipilih orang tua asuh.
   * @returns any Berhasil mendapatkan daftar mahasiswa.
   * @throws ApiError
   */
  public listMahasiswaOta({
    q,
    page,
    major,
    faculty,
    religion,
    gender,
  }: {
    q?: string,
    page?: number | null,
    major?: 'Matematika' | 'Fisika' | 'Astronomi' | 'Mikrobiologi' | 'Kimia' | 'Biologi' | 'Sains dan Teknologi Farmasi' | 'Aktuaria' | 'Rekayasa Hayati' | 'Rekayasa Pertanian' | 'Rekayasa Kehutanan' | 'Farmasi Klinik dan Komunitas' | 'Teknologi Pasca Panen' | 'Teknik Geologi' | 'Teknik Pertambangan' | 'Teknik Perminyakan' | 'Teknik Geofisika' | 'Teknik Metalurgi' | 'Meteorologi' | 'Oseanografi' | 'Teknik Kimia' | 'Teknik Mesin' | 'Teknik Elektro' | 'Teknik Fisika' | 'Teknik Industri' | 'Teknik Informatika' | 'Aeronotika dan Astronotika' | 'Teknik Material' | 'Teknik Pangan' | 'Manajemen Rekayasa Industri' | 'Teknik Bioenergi dan Kemurgi' | 'Teknik Sipil' | 'Teknik Geodesi dan Geomatika' | 'Arsitektur' | 'Teknik Lingkungan' | 'Perencanaan Wilayah dan Kota' | 'Teknik Kelautan' | 'Rekayasa Infrastruktur Lingkungan' | 'Teknik dan Pengelolaan Sumber Daya Air' | 'Seni Rupa' | 'Desain' | 'Kriya' | 'Desain Interior' | 'Desain Komunikasi Visual' | 'Desain Produk' | 'Teknik Tenaga Listrik' | 'Teknik Telekomunikasi' | 'Sistem Teknologi dan Informasi' | 'Teknik Biomedis' | 'Manajemen' | 'Kewirausahaan' | 'TPB',
    faculty?: 'FMIPA' | 'SITH-S' | 'SF' | 'FITB' | 'FTTM' | 'STEI-R' | 'FTSL' | 'FTI' | 'FSRD' | 'FTMD' | 'STEI-K' | 'SBM' | 'SITH-R' | 'SAPPK',
    religion?: 'Islam' | 'Kristen Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu',
    gender?: 'M' | 'F',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<MahasiswaListElement>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/mahasiswa/verified',
      query: {
        'q': q,
        'page': page,
        'major': major,
        'faculty': faculty,
        'religion': religion,
        'gender': gender,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List mahasiswa asuh beserta detailnya.
   * @returns any Berhasil mendapatkan daftar mahasiswa.
   * @throws ApiError
   */
  public listMahasiswaAdmin({
    q,
    page,
    jurusan,
    status,
  }: {
    q?: string,
    page?: number | null,
    jurusan?: string,
    status?: 'pending' | 'accepted' | 'rejected' | 'unregistered' | 'reapply' | 'outdated',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        id: string;
        email: string;
        type: 'mahasiswa' | 'admin' | 'ota';
        phoneNumber: string;
        provider: 'credentials' | 'azure';
        applicationStatus: 'pending' | 'accepted' | 'rejected' | 'unregistered' | 'reapply' | 'outdated';
        name: string;
        nim: string;
        mahasiswaStatus: 'active' | 'inactive';
        description: string;
        file: string;
        major: string;
        faculty: string;
        cityOfOrigin: string;
        highschoolAlumni: string;
        religion: 'Islam' | 'Kristen Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
        gender: 'M' | 'F';
        gpa: string;
        kk: string;
        ktm: string;
        waliRecommendationLetter: string;
        transcript: string;
        salaryReport: string;
        pbb: string;
        electricityBill: string;
        ditmawaRecommendationLetter: string;
        notes: string;
        adminOnlyNotes: string;
      }>;
      totalPagination: number;
      totalData: number;
      totalPending: number;
      totalAccepted: number;
      totalRejected: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/mahasiswa/details',
      query: {
        'q': q,
        'page': page,
        'jurusan': jurusan,
        'status': status,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List orang tua asuh beserta detailnya.
   * @returns any Berhasil mendapatkan daftar orang tua.
   * @throws ApiError
   */
  public listOrangTuaAdmin({
    q,
    page,
    status,
  }: {
    q?: string,
    page?: number | null,
    status?: 'pending' | 'accepted' | 'rejected',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        provider: 'credentials' | 'azure';
        status: 'verified' | 'unverified';
        applicationStatus: 'accepted' | 'rejected' | 'pending' | 'unregistered' | 'reapply' | 'outdated';
        job: string;
        address: string;
        linkage: 'otm' | 'dosen' | 'alumni' | 'lainnya' | 'none';
        funds: number | null;
        maxCapacity: number | null;
        startDate: string;
        maxSemester: number | null;
        transferDate: number | null;
        criteria: string;
        allowAdminSelection: boolean;
      }>;
      totalPagination: number;
      totalData: number;
      totalPending: number;
      totalAccepted: number;
      totalRejected: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua/details',
      query: {
        'q': q,
        'page': page,
        'status': status,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List orang tua asuh yang membantu saya
   * @returns any Berhasil mendapatkan daftar OTA-ku
   * @throws ApiError
   */
  public listOtaKu({
    q,
    page,
  }: {
    q?: string,
    page?: number | null,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        accountId: string;
        name: string;
        /**
         * Nomor telepon pengguna yang dimulai dengan 62.
         */
        phoneNumber: string;
        nominal: number;
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua',
      query: {
        'q': q,
        'page': page,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List mahasiswa asuh saya yang aktif
   * @returns any Berhasil mendapatkan daftar MA aktif
   * @throws ApiError
   */
  public listMaActive({
    q,
    page,
    major,
    faculty,
    religion,
    gender,
  }: {
    q?: string,
    page?: number | null,
    major?: 'Matematika' | 'Fisika' | 'Astronomi' | 'Mikrobiologi' | 'Kimia' | 'Biologi' | 'Sains dan Teknologi Farmasi' | 'Aktuaria' | 'Rekayasa Hayati' | 'Rekayasa Pertanian' | 'Rekayasa Kehutanan' | 'Farmasi Klinik dan Komunitas' | 'Teknologi Pasca Panen' | 'Teknik Geologi' | 'Teknik Pertambangan' | 'Teknik Perminyakan' | 'Teknik Geofisika' | 'Teknik Metalurgi' | 'Meteorologi' | 'Oseanografi' | 'Teknik Kimia' | 'Teknik Mesin' | 'Teknik Elektro' | 'Teknik Fisika' | 'Teknik Industri' | 'Teknik Informatika' | 'Aeronotika dan Astronotika' | 'Teknik Material' | 'Teknik Pangan' | 'Manajemen Rekayasa Industri' | 'Teknik Bioenergi dan Kemurgi' | 'Teknik Sipil' | 'Teknik Geodesi dan Geomatika' | 'Arsitektur' | 'Teknik Lingkungan' | 'Perencanaan Wilayah dan Kota' | 'Teknik Kelautan' | 'Rekayasa Infrastruktur Lingkungan' | 'Teknik dan Pengelolaan Sumber Daya Air' | 'Seni Rupa' | 'Desain' | 'Kriya' | 'Desain Interior' | 'Desain Komunikasi Visual' | 'Desain Produk' | 'Teknik Tenaga Listrik' | 'Teknik Telekomunikasi' | 'Sistem Teknologi dan Informasi' | 'Teknik Biomedis' | 'Manajemen' | 'Kewirausahaan' | 'TPB',
    faculty?: 'FMIPA' | 'SITH-S' | 'SF' | 'FITB' | 'FTTM' | 'STEI-R' | 'FTSL' | 'FTI' | 'FSRD' | 'FTMD' | 'STEI-K' | 'SBM' | 'SITH-R' | 'SAPPK',
    religion?: 'Islam' | 'Kristen Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu',
    gender?: 'M' | 'F',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        accountId: string;
        name: string;
        /**
         * Nomor Induk Mahasiswa
         */
        nim: string;
        /**
         * Status mahasiswa
         */
        mahasiswaStatus: 'active' | 'inactive';
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua/mahasiswa-asuh-active',
      query: {
        'q': q,
        'page': page,
        'major': major,
        'faculty': faculty,
        'religion': religion,
        'gender': gender,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List ajuan mahasiswa asuh saya yang masih pending
   * @returns any Berhasil mendapatkan daftar MA pending
   * @throws ApiError
   */
  public listMaPending({
    q,
    page,
    major,
    faculty,
    religion,
    gender,
  }: {
    q?: string,
    page?: number | null,
    major?: 'Matematika' | 'Fisika' | 'Astronomi' | 'Mikrobiologi' | 'Kimia' | 'Biologi' | 'Sains dan Teknologi Farmasi' | 'Aktuaria' | 'Rekayasa Hayati' | 'Rekayasa Pertanian' | 'Rekayasa Kehutanan' | 'Farmasi Klinik dan Komunitas' | 'Teknologi Pasca Panen' | 'Teknik Geologi' | 'Teknik Pertambangan' | 'Teknik Perminyakan' | 'Teknik Geofisika' | 'Teknik Metalurgi' | 'Meteorologi' | 'Oseanografi' | 'Teknik Kimia' | 'Teknik Mesin' | 'Teknik Elektro' | 'Teknik Fisika' | 'Teknik Industri' | 'Teknik Informatika' | 'Aeronotika dan Astronotika' | 'Teknik Material' | 'Teknik Pangan' | 'Manajemen Rekayasa Industri' | 'Teknik Bioenergi dan Kemurgi' | 'Teknik Sipil' | 'Teknik Geodesi dan Geomatika' | 'Arsitektur' | 'Teknik Lingkungan' | 'Perencanaan Wilayah dan Kota' | 'Teknik Kelautan' | 'Rekayasa Infrastruktur Lingkungan' | 'Teknik dan Pengelolaan Sumber Daya Air' | 'Seni Rupa' | 'Desain' | 'Kriya' | 'Desain Interior' | 'Desain Komunikasi Visual' | 'Desain Produk' | 'Teknik Tenaga Listrik' | 'Teknik Telekomunikasi' | 'Sistem Teknologi dan Informasi' | 'Teknik Biomedis' | 'Manajemen' | 'Kewirausahaan' | 'TPB',
    faculty?: 'FMIPA' | 'SITH-S' | 'SF' | 'FITB' | 'FTTM' | 'STEI-R' | 'FTSL' | 'FTI' | 'FSRD' | 'FTMD' | 'STEI-K' | 'SBM' | 'SITH-R' | 'SAPPK',
    religion?: 'Islam' | 'Kristen Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu',
    gender?: 'M' | 'F',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        accountId: string;
        name: string;
        /**
         * Nomor Induk Mahasiswa
         */
        nim: string;
        /**
         * Status mahasiswa
         */
        mahasiswaStatus: 'active' | 'inactive';
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua/mahasiswa-asuh-pending',
      query: {
        'q': q,
        'page': page,
        'major': major,
        'faculty': faculty,
        'religion': religion,
        'gender': gender,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List orang tua asuh yang tersedia untuk dipilih admin
   * @returns any Berhasil mendapatkan daftar OTA yang tersedia
   * @throws ApiError
   */
  public listAvailableOta({
    q,
    page,
  }: {
    q?: string,
    page?: number | null,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        accountId: string;
        name: string;
        /**
         * Nomor telepon pengguna yang dimulai dengan 62.
         */
        phoneNumber: string;
        nominal: number;
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/admin/ota/available',
      query: {
        'q': q,
        'page': page,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
}
