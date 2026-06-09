const ProjectSkeleton = () => (
  <div className="pd-page">

    {/* Hero skeleton */}
    <div className="pd-skeleton pd-skeleton--hero" />

    {/* Content skeleton */}
    <div className="pd-content">

      {/* CTA row */}
      <div className="pd-cta-row">
        <div className="pd-skeleton pd-skeleton--btn" />
        <div className="pd-skeleton pd-skeleton--btn" />
      </div>

      <div className="pd-sections">

        {/* Description block */}
        <div className="pd-section">
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '30%', marginBottom: 20 }} />
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '100%', marginBottom: 10 }} />
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '92%',  marginBottom: 10 }} />
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '78%' }} />
        </div>

        {/* Screenshots strip */}
        <div className="pd-section">
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '25%', marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="pd-skeleton pd-skeleton--thumb" />
            ))}
          </div>
        </div>

        {/* Tech stack chips */}
        <div className="pd-section">
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '20%', marginBottom: 20 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pd-skeleton pf-skeleton--tag" style={{ width: 80 }} />
            ))}
          </div>
        </div>

        {/* Features list */}
        <div className="pd-section">
          <div className="pd-skeleton pf-skeleton--line" style={{ width: '22%', marginBottom: 20 }} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="pd-skeleton pf-skeleton--line"
              style={{ width: `${85 - i * 8}%`, marginBottom: 12 }}
            />
          ))}
        </div>

      </div>
    </div>
  </div>
);

export default ProjectSkeleton;
