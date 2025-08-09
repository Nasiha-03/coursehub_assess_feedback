import API from './path/to/your/api/file';

API.post('/api/download-report', {
  name: 'John Doe',
  subject: 'Math',
  score: 85,
  date: '2025-07-30',
}, {
  responseType: 'blob'
}).then((res) => {
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'report.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
});
