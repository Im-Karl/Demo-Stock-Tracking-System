import React from 'react';
import { RiGlobalLine, RiFacebookFill, RiPhoneFill, RiShieldCheckFill } from 'react-icons/ri';
import Badge from '../base-ui/Badge';
import Button from '../base-ui/Button';

export default function StockHeader({ symbol, companyInfo }) {
  if (!companyInfo) return null;

  return (
    <div className="flex flex-col gap-6 mb-10">
      {/* Row 1: Badges & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-grey-200 dark:border-grey-800">
        <div className="flex items-center gap-3">
          <Badge intent="primary" variant="soft" size="lg" className="font-black">
            {companyInfo.exchange || 'OTC'}
          </Badge>
          {companyInfo.status === 'listed' && (
            <Badge intent="success" variant="soft" size="lg" className="flex items-center gap-1 font-bold">
              <RiShieldCheckFill size={16} /> Niêm yết
            </Badge>
          )}
          <div className="w-px h-6 bg-grey-200 dark:bg-grey-800 mx-2 hidden sm:block"></div>
          <span className="text-sm text-grey-500 uppercase font-black tracking-[0.2em] opacity-70">
            {companyInfo.organ_name_en}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {companyInfo.url && (
            <Button
              intent="neutral"
              variant="soft"
              size="md"
              render={<a href={companyInfo.url} target="_blank" rel="noopener noreferrer" />}
            >
              <RiGlobalLine size={18} /> Website
            </Button>
          )}

          {companyInfo.facebookUrl && (
            <Button
              intent="primary"
              variant="solid"
              size="md"
              render={<a href={companyInfo.facebookUrl} target="_blank" rel="noopener noreferrer" />}
              className="!bg-[#1877F2]"
            >
              <RiFacebookFill size={18} /> Facebook
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: Description */}
      <div>
        <p className="text-grey-600 dark:text-grey-300 leading-relaxed text-base">
          {companyInfo.introduce || 'Chưa có thông tin giới thiệu cho doanh nghiệp này.'}
        </p>

        {/* Row 3: Hotline */}
        {companyInfo.hotline && companyInfo.hotline.length > 0 && (
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <span className="text-[10px] text-grey-400 uppercase font-black tracking-widest">Hotline:</span>
            <div className="flex flex-wrap gap-6">
              {companyInfo.hotline.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone}`}
                  className="text-grey-900 dark:text-grey-50 font-bold hover:text-primary-500 flex items-center gap-2 transition-colors border-b-2 border-primary-500/10 hover:border-primary-500"
                >
                  <RiPhoneFill size={16} className="text-primary-500" /> {phone}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
