import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F7F6F3]">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-[48px] font-semibold text-[#37352F] tracking-[-0.5px] leading-[1.15] mb-4">
            Let's Connect <span className="font-japanese">· 連絡</span>
          </h2>
          <p className="text-[16px] text-[#787774] leading-[1.55] max-w-2xl">
            Whether you have a project in mind, want to collaborate, or just say hello — I'd love to
            hear from you.
          </p>
        </div>

        {/* Bold Yellow Banner Card */}
        <div className="bg-[#FFFCE5] rounded-[12px] p-10 mb-6 border border-[#E9E9E7]">
          {/* Avatar */}
          <div className="w-16 h-16 bg-[#7766E4] rounded-full flex items-center justify-center mb-6">
            <span className="text-xl font-japanese text-white">こ</span>
          </div>

          <h3 className="text-[28px] font-semibold text-[#37352F] leading-[1.25] mb-6">
            Ready to Start Something Amazing?
          </h3>

          {/* Email */}
          <div className="mb-8">
            <p className="text-sm text-[#45413C] mb-2">
              Drop me a line and let's discuss your next project
            </p>
            <a
              href="mailto:baxin1919@gmail.com"
              className="text-[18px] font-medium text-[#7766E4] hover:text-[#6655D8] transition-colors"
            >
              baxin1919(at-mark)gmail.com
            </a>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#45413C] border border-[#45413C]/30 bg-transparent rounded-[8px] hover:bg-[#45413C]/10 transition-colors"
              onClick={() => window.open('https://baxin.pages.dev/', '_blank')}
            >
              <span>📖</span>
              <span>Read My Blog</span>
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-[#7766E4] rounded-[8px] hover:bg-[#6655D8] transition-colors"
              onClick={() => {
                window.location.href = 'mailto:baxin1919@gmail.com?subject=Hello%20Koji!';
              }}
            >
              <span>✉️</span>
              <span>Send Email</span>
            </button>
          </div>
        </div>

        {/* Japanese Closing */}
        <div className="text-center py-4">
          <p className="text-[18px] font-japanese text-[#37352F] mb-1">ありがとうございます</p>
          <p className="text-sm text-[#9B9A97]">Thank you for visiting my portfolio</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-8 border-t border-[#E9E9E7]">
          <p className="text-sm text-[#9B9A97] font-japanese">
            © {new Date().getFullYear()} Koji · こうじ
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
